/**
 * Set data in mocked storage
 *
 * Set the given value for the given key in mocked vm storage.
 *
 * @param {string} k - Key to set the data to.
 * @param {string} v - Value to set in storage.
 *
 * @returns {void}
 */
// @ts-ignore: decorator
@external("massa", "set_data")
export declare function setData(k:string, v:string):void;

/**
 * Get data in mocked storage
 *
 * Get the given value for the given key in mocked vm storage.
 *
 * @param {string} k - Key to set the data to.
 */
// @ts-ignore: decorator
@external("massa", "get_data")
export declare function getData(k:string):string;
