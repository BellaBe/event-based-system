import axios from "axios";

process.env.NODE_TLS_REJECT_UNAYTHORIZED = "0";

const cookie = "";
const doRequest = async () => {
  const data = await axios.post(
    "https://ticketing.dev/api/tickets",
    {
      title: "ticket",
      price: 5,
    },
    {
      headers: { cookie },
    }
  );
  await axios.put(
    `https://ticketing.dev/api/tickets/${data.id}`,
    {
      title: "ticket",
      price: 15,
    },
    {
      headers: { cookie },
    }
  );
  axios.put(
    `https://ticketing.dev/api/tickets/${data.id}`,
    {
      title: "ticket",
      price: 15,
    },
    {
      headers: { cookie },
    }
  );
};

(async () => {
  for (let i = 0; i < 400; i++) {
    doRequest();
  }
})();
