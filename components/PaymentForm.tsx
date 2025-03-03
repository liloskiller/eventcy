'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Wallet } from 'lucide-react'
import styles from '@/styles/payment-modal.module.css'

interface PaymentFormProps {
  amount: number
  onSuccess: () => void
}

export default function PaymentForm({ amount, onSuccess }: PaymentFormProps) {
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically process the payment
    onSuccess()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={styles.modal}
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.payment__options}>
          <button
            type="button"
            className={paymentMethod === 'card' ? 'bg-purple-100' : ''}
            onClick={() => setPaymentMethod('card')}
          >
            <CreditCard className="mx-auto" />
          </button>
          <button
            type="button"
            className={paymentMethod === 'cash' ? 'bg-purple-100' : ''}
            onClick={() => setPaymentMethod('cash')}
          >
            <Wallet className="mx-auto" />
          </button>
        </div>

        <div className={styles.separator}>
          <hr className={styles.line} />
          <p>Pay €{amount}</p>
          <hr className={styles.line} />
        </div>

        {paymentMethod === 'card' ? (
          <div className={styles.credit_card_info__form}>
            <div className={styles.input_container}>
              <label className={styles.input_label}>Card Number</label>
              <input
                className={styles.input_field}
                type="text"
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
              />
            </div>
            <div className={styles.split}>
              <div className={styles.input_container}>
                <label className={styles.input_label}>Expiry Date</label>
                <input
                  className={styles.input_field}
                  type="text"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  required
                />
              </div>
              <div className={styles.input_container}>
                <label className={styles.input_label}>CVV</label>
                <input
                  className={styles.input_field}
                  type="number"
                  placeholder="000"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-sm text-gray-600 dark:text-gray-300">
            Pay in cash at the entrance
          </div>
        )}

        <button className={styles.purchase__btn} type="submit">
          {paymentMethod === 'card' ? 'Pay Now' : 'Confirm Payment at Entrance'}
        </button>
      </form>
    </motion.div>
  )
}

