import { promises, createReadStream, statSync, stat } from "node:fs";

const fileName = "./big.file";

try {
  const file = await promises.readFile(fileName);
  console.log("file size", file.byteLength / 1e9, "GB", "\n");
  console.log("fileBuffer", file);
} catch (error) {
  console.log("error: max 2gb reached", error.message);
}

const { size } = statSync(fileName);
console.log("file size", size / 1e9, "GB", "\n");

let chunkConsumed = 0;
const stream = createReadStream(fileName)
  // 65536 || 65k per readable!
  // triggered by the first stream.read
  .once("data", (msg) => {
    console.log("on data length", msg.toString().length);
  })

  .once("readable", (r) => {
    // this stream.read(11) will trigger the on(data) event
    console.log("read 11 chunk bytes", stream.read(11).toString());
    console.log("read 05 chunk bytes", stream.read(5).toString());

    chunkConsumed += 11 + 5;
  })

  .on("readable", (_) => {
    let chunk;
    //stream.read() read max 65kbytes per time
    while (null !== (chunk = stream.read())) {
      chunkConsumed += chunk.length;
    }
  })

  .on("end", () => {
    console.log(`Read ${chunkConsumed / 1e9} bytes of data...`);
  });
