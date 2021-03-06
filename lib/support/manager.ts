import BaseManager from './basemanager'

/**
 * Manager abstract class
 */
export default abstract class Manager<T> extends BaseManager<T> {
  /**
   * Get the instance
   * @param {string} name
   * @returns {T}
   */
  async get (name?: string): Promise<T> {
    if (!name) {
      await this.createFirst()
      return this.instances[this.instancesConfig[0].name]
    }

    await this.createSingle(name)
    return this.instances[name]
  }

  /**
   * Get all instances
   * @returns {T}
   */
  async all (): Promise<{ [key: string]: T }> {
    await this.createAll()
    return { ...this.instances }
  }
}
