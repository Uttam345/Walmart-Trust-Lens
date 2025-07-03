import type { NextApiRequest, NextApiResponse } from 'next'
import { lookupBarcode } from '@/lib/barcode-api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { barcode } = req.query
  if (!barcode || typeof barcode !== 'string') {
    return res.status(400).json({ error: 'Barcode is required' })
  }
  try {
    const product = await lookupBarcode(barcode)
    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }
    return res.status(200).json(product)
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' })
  }
}
