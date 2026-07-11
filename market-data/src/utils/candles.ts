import axios from "axios";

async function getHistoricalCandles(
  instrumentKey: string,
  accessToken: string,
  fromDate: string,
  toDate: string,
) {
  const response = await axios.get(
    `${process.env.DAILY_CANDLE_FALLBACK}/${encodeURIComponent(instrumentKey)}/days/1/${toDate}/${fromDate}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    },
  );

  return response.data.data.candles;
}

export {getHistoricalCandles};