import { BcThing } from './BcThing'
import { isBlockHash } from '../../lib/utils'

export class BlockTrace extends BcThing {
  constructor (hash, { nod3, collections, log, initConfig }) {
    if (!isBlockHash(hash)) throw new Error(`Invalid blockHash ${hash}`)
    super({ nod3, collections, log, initConfig })
    this.hash = hash
    this.collection = collections.BlocksTraces
  }
  async fetch () {
    try {
      let { hash } = this
      let data = await this.getFromDb()
      if (!data) {
        data = await this.nod3.trace.block(hash)
        await this.save(data)
      }
      return data
    } catch (err) {
      return Promise.reject(err)
    }
  }
  async getFromDb () {
    try {
      let { hash, collection } = this
      let res = await collection.findOne({ hash })
      return (res) ? res.data : null
    } catch (err) {
      return Promise.reject(err)
    }
  }
  save (data) {
    if (!data) return this.fetch()
    let { hash } = this
    return this.collection.insertOne({ hash, data })
  }
}

export default BlockTrace
