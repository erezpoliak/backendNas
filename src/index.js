import "dotenv/config";
import express from "express";
import cors from "cors";

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

let mockDb = [
  {
    number: "663880992",
    slot: "77b19082",
  },
  {
    number: "663880945",
    slot: "888a90123",
  },
  {
    number: "663880908",
    slot: "888a90122",
  },
  {
    number: "663889032",
    slot: "888a90120",
  },
];

let now = Date.now();
const interval = 10000;
let tokens = 10;
let timestamp = Date.now();

const updateBucket = () => {
  now = Date.now();
  if (Math.floor((now - timestamp) / interval) > 0) {
    tokens = 10;
    timestamp = Date.now();
  }
};

app.listen(process.env.PORT || 8080, () => {
  console.log(`listening on port ${process.env.PORT}`);
});

app.post("/", (req, res) => {
  if (tokens > 0) {
    tokens--;
    if (mockDb.length < process.env.PARKINGLOTSIZE) {
      const car = { number: req.body.carNum, slot: generateSlotNum() };
      mockDb.push(car);
      return res.send(car.slot);
    } else {
      return res.send("parking lot is full");
    }
  } else res.send("access denied");
  updateBucket();
});

app.delete("/:slotNum", (req, res) => {
  if (tokens > 0) {
    tokens--;
    const result = mockDb.filter((car) => car.slot !== req.params.slotNum);
    if (result.length === mockDb.length) res.send("no slot number found");
    else {
      mockDb = [...result];
      res.send(`new parking lot after removal ${Object.values(result)}`);
    }
  } else res.send("access denied");
  updateBucket();
});

app.get("/:num", (req, res) => {
  if (tokens > 0) {
    tokens--;
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
  } else res.send("access denied");
  updateBucket();
});
