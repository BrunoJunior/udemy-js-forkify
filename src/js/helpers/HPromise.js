/**
 * Encapsulate the original promise with a timeout
 * If the timeout end before the original promise, the final Promise will be rejected
 * @template T
 * @param {Promise<T>} originalPromise
 * @param {number} seconds
 * @return {Promise<T>}
 */
export function timeout(originalPromise, seconds) {
  const timeout = new Promise(function(_, reject) {
    setTimeout(function() {
      reject(new Error(`Request took too long! Timeout after ${seconds} second`));
    }, seconds * 1000);
  });
  return Promise.race([originalPromise, timeout]);
}