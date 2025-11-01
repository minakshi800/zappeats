import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

const StripeCardElement = () => {
  const stripe = useStripe()
  const elements = useElements()

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#1f2937',
        fontFamily: 'system-ui, sans-serif',
        '::placeholder': {
          color: '#9ca3af',
        },
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444',
      },
    },
    hidePostalCode: true,
  }

  return (
    <div className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-dark-border bg-white dark:bg-dark-darker">
      <CardElement options={cardElementOptions} />
    </div>
  )
}

export default StripeCardElement

