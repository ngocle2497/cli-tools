import { Command as CommanderCommand } from "commander";
import { appIconSetup } from "./command";

const pkgJson = require("../package.json");

const program = new CommanderCommand()
  .usage("[command] [option]")
  .version(pkgJson.version, "-v", "Output the current version");

async function setUp() {
  appIconSetup(program);
}

async function run() {
  setUp();
  program.parse(process.argv);
}

export { run };
