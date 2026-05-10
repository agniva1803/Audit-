let counter = 0;
module.exports = {
  nanoid: (size) => `test-id-${++counter}`,
};
