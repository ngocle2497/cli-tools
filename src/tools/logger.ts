import chalk from "chalk";

const warn = (messages: string) => {
  console.warn(`${chalk.yellow.bold("Warn")} ${messages}`);
};

const error = (messages: string) => {
  console.error(`${chalk.red.bold("Error")} ${messages}`);
};

const log = (...messages: Array<string>) => {
  console.log(`${messages}`);
};
export { warn, error, log };
