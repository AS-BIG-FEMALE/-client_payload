const qrcode = require("qrcode-terminal");
const { Client, Buttons, LocalAuth, WAState } = require("whatsapp-web.js");
const { SSHAccount } = require("../Controller/SSHAccount.controller");
const fs = require("fs");
const { readFile } = require("fs/promises");
const path = require("path");

const { messageFormatter } = require("../Util/message.formatter");
const { client_model } = require("../Model/client.model");
const { pix } = require("../Controller/pix.generate");
const logger = require("../Log/logger");
const saveOrder = require("../Controller/order_save.controller");

const { SSHTestAccount } = require("../Controller/SSHTestAccount.controller");

const { update } = require("./payout");
const {
  link_downloads,
  link_suporte,
  deleteOrderThatSatusChangeOfPendingToApproved,
} = require("../Util/util");

const getWelcomeMessage = () => {
  const file = fs.readFileSync(
    path.join(__dirname, "..", "Messages", "welcome.json"),
    { encoding: "utf-8" }
  );
  return JSON.parse(file);
};

const getButtonCTA = () => {
  const file = fs.readFileSync(
    path.join(__dirname, "..", "Messages", "callToAction.json"),
    { encoding: "utf-8" }
  );
  return JSON.parse(file);
};

const getContato = async function () {
  const config = await readFile(
    path.join(__dirname, "..", "Config", "geral.json"),
    "utf-8"
  );

  const [content] = JSON.parse(config).Suporte;
  return content;
};

const getMenu = () => {
  const file = fs.readFileSync(
    path.join(__dirname, "..", "Messages", "menu.json"),
    {
      encoding: "utf-8",
    }
  );
  return JSON.parse(file);
};
const getProducts = () => {
  const file = fs.readFileSync(
    path.join(__dirname, "..", "Config", "products.json"),
    { encoding: "utf-8" }
  );

  return JSON.parse(file)["premium"];
};

const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
const getPix = async (amount) => {
  client_model.transaction_amount = parseFloat(amount);
  return await pix(client_model);
};

const messageParse = (msg) => {
  const jsonObject = JSON.stringify(msg);
  const jsonObjectToArray = JSON.parse(jsonObject);
  const user = jsonObjectToArray["_data"]["notifyName"];
  const selectedButtonId = jsonObjectToArray["_data"]["selectedButtonId"];
  return {
    user: user,
    selectedButtonId: selectedButtonId,
  };
};

const onMessageSymbol = Symbol("onMessage");
const onLoadQRCodeSymbol = Symbol("onLoadQRCode");
const onReadySymbol = Symbol("onReady");
const onOrderApprovedCreateAccountSymbol = Symbol(
  "onOrderApprovedCreateAccount"
);
class Assistent {
  #bot;
  constructor() {
    this.#bot = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },
    });
    this.#bot.initialize();
    this[onLoadQRCodeSymbol]();
    this[onReadySymbol]();
    this[onMessageSymbol]();
  }

  [onLoadQRCodeSymbol] = () => {
    this.#bot.on("qr", (qr) => {
      // Generate and scan this code with your phone
      qrcode.generate(qr, { small: true }, (code) => {
        console.log(code);
      });
    });
  };

  [onReadySymbol] = () => {
    this.#bot.on("ready", () => {
      logger.info("❭ Assistente está conectado! ❬");
      this[onOrderApprovedCreateAccountSymbol]();
      update();
    });
  };

  [onMessageSymbol] = () => {
    this.#bot.on("message", async (msg) => {
      const { user, selectedButtonId } = messageParse(msg);

      if (msg.body == "oi" || msg.body == "Oi" || msg.body == "OI") {
        const { text, buttons, title, footer } = getWelcomeMessage();

        let button = new Buttons(
          text.replace("$user", user),
          buttons,
          title,
          footer
        );
        this.#bot.sendMessage(msg.from, button);

        return;
      }

      if (selectedButtonId == "continuar") {
        const { text, buttons, title, footer } = getMenu();

        let button = new Buttons(text, buttons, title, footer);
        this.#bot.sendMessage(msg.from, button);
        return;
      }

      if (selectedButtonId == "comprar") {
        const ofertas = getProducts();
        const produtos = ofertas.map((element) => {
          const { id, titulo, descricao, preco, validade, limite } = element;

          const button = {
            text: ` 📌 *${titulo}* 📌\n\n👜 *${descricao}*\n\n💰 *Preço:* ${preco}\n\n📅 *Validade:* ${validade} dias\n\n👤 *Usuários:* ${limite} por vez`,
            buttons: [{ body: "Comprar", id: `${id}` }],
          };
          return button;
        });

        for (let lista of produtos) {
          let button = new Buttons(lista.text, lista.buttons, "", "");
          this.#bot.sendMessage(msg.from, button);
        }
        return;
      }

      if (selectedButtonId == "teste") {
        const sshtestaccount = SSHTestAccount.initialize({
          chat_id: msg.from,
        });

        if (sshtestaccount.block()) {
          await this.#bot.sendMessage(
            msg.from,
            "😟 *Sinto muito, mas você já esgotou seu limite de teste grátis. Mas não fique sem internet, aproveite e compre agora e recebar na hora seu acesso.*"
          );
          const { text, buttons, title, footer } = getButtonCTA();
          let button = new Buttons(text, buttons, title, footer);
          await delay(15000);
          this.#bot.sendMessage(msg.from, button);
          return;
        }

        await this.#bot.sendMessage(
          msg.from,
          "*⏳ Só um momento estou gerando o seu teste gratis* 😜"
        );

        const testssshMap = await sshtestaccount.create();
        const { PlayStore, MediaFire } = await link_downloads();
        const { contato } = await link_suporte();

        await this.#bot.sendMessage(
          msg.from,
          `*CONTA CRIADA COM SUCESSO!*\n\n*Usuário:* ${testssshMap.get(
            "User"
          )}\n*Senha:* ${testssshMap.get("Pass")}\n*Expira:* ${testssshMap.get(
            "Exp"
          )}\n*Limite:* ${testssshMap.get("Lim")}
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
Link de download
PlayStore: ${PlayStore}
MediaFire: ${MediaFire}
SUPORTE: ${contato}
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
Obrigado por adquirir nosso produto.`
        );
        return;
      }

      if (selectedButtonId == "duvida") {
        const { contato } = await link_suporte();
        await this.#bot.sendMessage(msg.from, `Entre em contato: ${contato}`);
      }

      const recover_products = getProducts();

      const bought_product = recover_products.find(
        (find) => find.id == selectedButtonId
      );

      if (bought_product != undefined) {
        await this.#bot.sendMessage(
          msg.from,
          "*⏳ Estou gerando o seu codigo pix para pagamento...*"
        );
        const { qrcode, id } = await getPix(bought_product.preco);
        await saveOrder(id, msg.from, bought_product.id);
        await this.#bot.sendMessage(msg.from, qrcode);
        await this.#bot.sendMessage(
          msg.from,
          "🤩 Você receberá seu acesso automáticamente após pagar o pix acima ☝️ *ATENÇÃO* ‼️ caso seu acesso não chegue em até 5 minutos escreva no chat *_Não recebi a minha conta_* em seguida sera enviado caso seu pagamento esteja confirmado!"
        );

        await this.#bot.sendMessage(msg.from, `*Pedido:* ${id}`);
        return;
      }
    });
  };

  [onOrderApprovedCreateAccountSymbol] = async () => {
    // Verifica se axiste alguma ordem aprovada no arquivo order.approved.json
    // Se existir ele cria o a conta e envia
    setInterval(async () => {
      const fileContentPath = fs.readFileSync(
        path.join(__dirname, "..", "Usuarios", "order.approved.json"),
        { encoding: "utf-8" }
      );
      if (!fileContentPath) return;
      const orderApprovedList = JSON.parse(fileContentPath);
      const orderListNotEmpty = orderApprovedList.length > 0;
      if (orderListNotEmpty) {
        const [first, ...rest] = orderApprovedList;
        const { chat_id, order_id, item } = first;
        const sshaccount = SSHAccount.initialize({ order_id, chat_id, item });
        const account = await sshaccount.create();
        await deleteOrderThatSatusChangeOfPendingToApproved(
          path.join(__dirname, "..", "Usuarios", "order.approved.json")
        );
        const message = await messageFormatter(account);

        this.#bot.sendMessage(account.get("chat_id"), message);
      }
    }, 30000);
  };

  static initialize = function () {
    const assistent = new Assistent();
    return assistent;
  };

  /*
  

 
 
  this.client.on("disconnected", (reason) => {
    console.log("client was logged out", reason);
    setTimeout(() => {
      console.log("Restarting ...");
      start();
    }, 300);
  });
  */
}

module.exports = Assistent;
