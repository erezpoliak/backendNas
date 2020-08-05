import "dotenv/config";
import express from "express";
import cors from "cors";
import mockDb from "./mockDb";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const generateSlotNum = () => {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const charactersLength = characters.length;
  for (let i = 0; i < 13; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

app.listen(process.env.PORT || 8080, () => {
  console.log(`listening on port ${process.env.PORT}`);
});

app.post("/", (req, res) => {
  if (mockDb.length < process.env.PARKINGLOTSIZE) {
    const car = { number: req.body.carNum, slot: generateSlotNum() };
    mockDb.push(car);
    return res.send(car.slot);
  } else {
    return res.send("parking lot is full");
  }
});

app.delete("/:slotNum", (req, res) => {
  const result = mockDb.filter((car) => car.slot !== req.params.slotNum);
  res.send(`new parking lot after removal ${result}`);
});

app.get("/:num", (req, res) => {
  let index = mockDb.findIndex((car) => car.number === req.params.num);
  if (index !== -1)
    return res.send(
      `car number is ${mockDb[index].number} and slot is ${mockDb[index].slot}`
    );
  else {
    let index = mockDb.findIndex((car) => car.slot === req.params.num);
    if (index !== -1)
      return res.send(
        `car number is ${mockDb[index].number} and slot is ${mockDb[index].slot}`
      );
    else return res.send("no car or slot was found");
  }
});
