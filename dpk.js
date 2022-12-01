const crypto = require("crypto");

/**
 * Takes in any input to deterministically produce a partition key under MAX_PARTITION_KEY_LENGTH
 * - If the input contains a field partitionKey, use it directly
 *   - Otherwise just stringify the input
 * - If either of them are longer than the MAX_PARTITION_KEY_LENGTH, hash them down to size to deterministically reduce length
 * - If no input provided, return a trivial hash
 * @param input
 * @returns {string}
 */


const idempotentStringify = (obj) => {
    if (typeof obj === "string") {
        return obj;
    } else {
        return JSON.stringify(obj);
    }
}

const hashObject = (obj) => {
    return crypto.createHash("sha3-512").update(idempotentStringify(obj)).digest("hex");
}

exports.deterministicPartitionKey = (input) => {
    const TRIVIAL_PARTITION_KEY = "0";
    const MAX_PARTITION_KEY_LENGTH = 256;

    if (!input) {
        return TRIVIAL_PARTITION_KEY
    }

    if (input.partitionKey) {
        let stringPartitionKey = idempotentStringify(input.partitionKey);
        if (stringPartitionKey.length > MAX_PARTITION_KEY_LENGTH) {
            return hashObject(input.partitionKey);
        } else {
            return stringPartitionKey;
        }
    }

    return hashObject(input);
};
