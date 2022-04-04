module.exports = {
  /**
   * A set of globs passed to the glob package that qualify typescript files for testing.
   */
  include: ['assembly/__tests__/**/*.spec.ts'],
  /**
   * A set of globs passed to the glob package that quality files to be added to each test.
   */
  add: ['assembly/__tests__/**/*.include.ts'],
  /**
   * All the compiler flags needed for this test suite. Make sure that a binary file is output.
   */
  flags: {
    '--exportRuntime': [],
    /** To output a wat file, uncomment the following line. */
    // "--textFile": ["output.wat"],
    /** A runtime must be provided here. */
    '--runtime': ['incremental'], // Acceptable values are: "incremental", "minimal", and "stub"
  },
  /**
   * A set of regexp that will disclude source files from testing.
   */
  disclude: [/node_modules/],
  /**
   * Add your required AssemblyScript imports here.
   */
  imports(memory, createImports, instantiateSync, binary) {
    const createMockVm = require('mscl-vm-mock');
    return createMockVm(memory, createImports, instantiateSync, binary);
  },
  /** Enable code coverage. */
  // coverage: ["assembly/**/*.ts"],
  /**
   * Specify if the binary wasm file should be written to the file system.
   */
  outputBinary: false,
};
