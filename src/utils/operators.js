// WONA (Econet Zimbabwe) is the only operator — see wiki/raw/operator-brief.md.
// Subscriber username = username_prefix + 10-digit mobile number, e.g. ecozw0777123456.
export const WONA_OPERATOR = {
  operator_id: "274",
  operator_uid: "econetzw",
  username_prefix: "ecozw",
  country: "Zimbabwe (zw)",
  api_url: "https://ott.tvanywhereafrica.com:28182",
};

const OPERATORS = {
  econetzw: WONA_OPERATOR,
};

export default OPERATORS;
