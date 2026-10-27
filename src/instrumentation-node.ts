import { ServerResponse } from 'node:http'
import { withAcceptVary } from './lib/vary'

/**
 * The App Router replaces Vary with `res.setHeader`, dropping the Accept
 * token the proxy added. Put it back on that write so HTML and markdown
 * stay distinct cache variants in production.
 */
export function registerNodeInstrumentation() {
    const original = ServerResponse.prototype.setHeader
    ServerResponse.prototype.setHeader = function setHeaderWithAcceptVary(name, value) {
        if (typeof name === 'string' && name.toLowerCase() === 'vary' && value != null) {
            return original.call(this, name, withAcceptVary(value))
        }
        return original.call(this, name, value)
    }
}
