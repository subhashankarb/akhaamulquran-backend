// src/config/clickhouse.ts
import { createClient, ClickHouseClient } from '@clickhouse/client'

let client: ClickHouseClient | null = null

const connectClickHouse = () => {
  if (client) return client

  const url = `http://${process.env.CLICKHOUSE_HOST || 'localhost'}:${process.env.CLICKHOUSE_PORT || '8123'}`

  client = createClient({
    url,
    username: process.env.CLICKHOUSE_USER || 'default',
    password: process.env.CLICKHOUSE_PASSWORD || '',
    database: process.env.CLICKHOUSE_DATABASE || 'default',
  })

  console.log('ClickHouse connected')
  return client
}

export const getClickHouseClient = () => {
  if (!client) throw new Error('ClickHouse not initialized')
  return client
}

export default connectClickHouse
