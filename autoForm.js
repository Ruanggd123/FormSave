// autoForm.js
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const FORM_URL =
  "https://docs.google.com/forms/u/0/d/e/1FAIpQLSe1AXq-CseiPoSFnXX8EvvnV-p2vTQTYVJBFTI12Ae1iLLi8g/formResponse";
const COOKIE_PATH = path.resolve(__dirname, "sessions", "cookiesTeste.json");

// dados a enviar
const DATA = {
  nome: "Francisco Ruan Gomes Damasceno",
  local: "UFC",
  opcao: "SUBIR (17:00HRS)",
};

// mapeamento das entradas do formulário
const ENTRY = {
  nome: "entry.1623413518",
  local: "entry.1129303415",
  opcao: "entry.1737551379",
};

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // restaura cookies (sessão logada)
  if (fs.existsSync(COOKIE_PATH)) {
    const cookies = JSON.parse(fs.readFileSync(COOKIE_PATH, "utf8"));
    await page.setCookie(...cookies);
  }

  // navega pro form
  await page.goto(FORM_URL.replace("/formResponse", "/viewform"), {
    waitUntil: "networkidle2",
  });

  // preenche
  await page.type(`[name="${ENTRY.nome}"]`, DATA.nome);
  await page.type(`[name="${ENTRY.local}"]`, DATA.local);
  await page.type(`[name="${ENTRY.opcao}"]`, DATA.opcao);

  // envia
  await Promise.all([
    page.click('form [type="submit"]'),
    page.waitForNavigation({ waitUntil: "networkidle2" }),
  ]);

  console.log(`✅ Form enviado em ${new Date().toLocaleString()}`);
  await browser.close();
})();
