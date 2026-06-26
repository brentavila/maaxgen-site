import fs from "fs";
import path from "path";

function write(rel, content) {
  const p = path.join(process.cwd(), rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content, "utf8");
}

write("src/styles/global.css", fs.readFileSync("scripts/global.css.stub", "utf8"));
