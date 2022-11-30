const crypto = require("crypto");

/**
 * Takes in any input to deterministically produce a partition key under MAX_PARTITION_KEY_LENGTH
 * - If the input contains a field partitionKey, use it directly
 *   - Otherwise just stringify the input
 * - If either of them are longer than the MAX_PARTITION_KEY_LENGTH, hash them down to size to deterministically reduce length
 * - If no input provided, return a trivial hash
 * @param event
 * @returns {string}
 */
exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;
  let candidate;

  if (event) {
    if (event.partitionKey) {
      candidate = event.partitionKey;
    } else {
      const data = JSON.stringify(event);
      // Can just return here
      candidate = crypto.createHash("sha3-512").update(data).digest("hex");
    }
  }

  if (candidate) {
    if (typeof candidate !== "string") {
      candidate = JSON.stringify(candidate);
    }
  } else {
    candidate = TRIVIAL_PARTITION_KEY;
  }

  if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
    candidate = crypto.createHash("sha3-512").update(candidate).digest("hex");
  }
  return candidate;
};
