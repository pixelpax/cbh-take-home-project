const { deterministicPartitionKey } = require("./dpk");

describe("deterministicPartitionKey without input", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it ("When given a short partitionKey, just return", () => {

    let premadePartitionKey = "foo";
    const testEvent = {
      partitionKey: premadePartitionKey
    }

    let dpk = deterministicPartitionKey(testEvent)
    expect(dpk).toBe(premadePartitionKey);
  });

  it("When given a long partition key, has it down to size", () => {
    let premadePartitionKey = '';
    for (let i = 0; i < 257; i++) {
      premadePartitionKey += 'f';
    }
    const testEvent = {
      partitionKey: premadePartitionKey
    }

    let dpk = deterministicPartitionKey(testEvent)
    // Derived with a separate sha3-512 implementation to ensure correctness
    let hashOfLotsOfFs = 'c6c1f214e9be6b1467e3057b25eaadac08edea242079e0c822f72a4508f07033ba217e89c161cae495aa2d9c2cc8a599c88d380d8d73536b073080586a73c9d9';
    expect(dpk).toBe(hashOfLotsOfFs);
  });

  it("When given a non-string as an explicit partitionKey, it will be stringified",()=> {
    let premadePartitionKey = {foo: 'bar'};

    const testEvent = {
      partitionKey: premadePartitionKey
    }

    let dpk = deterministicPartitionKey(testEvent)
    // Derived with a separate sha3-512 implementation to ensure correctness
    let objectStringified = '{"foo":"bar"}';
    expect(dpk).toBe(objectStringified);
  });

  it("When given an object without a partitionKey it hashes the object", () => {
    let premadePartitionKey = {foo: 'bar'};

    const testEvent = {
      premadePartitionKey
    }

    let dpk = deterministicPartitionKey(testEvent)
    // Derived with a separate sha3-512 implementation to ensure correctness
    let objectStringified = '{"foo":"bar"}';
    let prederivedHash = '5a709702e7f2252b3eb2a77718e38cc2117f3d6fc2e080d3076342eadaa7fa05699eaf0d851d531ffafaee32e1b15fc0cf0561cb339e114aa34a01be718c979d';
    expect(dpk).toBe(prederivedHash);
  });
});
