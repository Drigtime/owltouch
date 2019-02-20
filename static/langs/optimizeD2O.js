const fs = require("fs");
const languages = ["fr", "en", "es"];
// const d2o = ["Items", "Monsters"];

languages.forEach(language => {
  const content = JSON.parse(fs.readFileSync(`./${language}/Monsters.json`));
  const newContent = Object.values(content).map(item => {
    delete item.gfxId;
    return item;
  });
  fs.writeFileSync(`./${language}/Monsters.json`, JSON.stringify(newContent));
});
