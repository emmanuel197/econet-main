import { useParams } from "react-router-dom";
import { getTvodTitle, getAccessOptions, formatPrice } from "../../data/tvodFixtures";
import { getCheckout } from "../../utils/tvodCheckout";

// The order being checked out: title (from the URL), chosen access option and payment
// details (from the saved checkout), plus the display strings every screen repeats.
const useTvodOrder = () => {
  const { id } = useParams();
  const checkout = getCheckout();
  const title = getTvodTitle(id);
  const options = getAccessOptions(title);
  const option = options.find((o) => o.id === checkout.optionId) || options[0];
  if (!title || !option) return { title: null };

  const isBuy = option.id === "buy";
  const packageLabel = isBuy ? "Buy · Own forever" : `${option.label} · ${option.hours}hrs`;
  return {
    title,
    option,
    checkout,
    isBuy,
    packageLabel,
    tag: isBuy ? "Buy · Own forever" : `${option.label} Rental · ${option.hours}hrs`,
    amount: formatPrice(option.price, true),
    amountDetail: `${title.title} · ${isBuy ? "Buy" : `${option.label} ${option.hours}hrs`}`,
  };
};

export default useTvodOrder;
