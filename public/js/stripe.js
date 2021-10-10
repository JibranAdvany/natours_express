import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51Jj5TyIdKl61hDU348Y3zo3lnEHUHqbmdsVdMxhjFq0yeLuBWNPYqqORuC1HHxYSi9mycOdQlpuX8f5NxmGMetUa00ZcFP39kJ'
);

export const bookTour = async tourId => {
  try {
    // 1. Get the session from the server
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    // 2. Create checkout form + charge the credit card.
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
