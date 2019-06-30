import { AppManager } from "./service/AppManager";

const appManager = new AppManager();

async function main() {
  const date = new Date();
  const result = await appManager.findOpenRestaurants(date);
  console.log(result);
}

main();


