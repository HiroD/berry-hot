import React, {useCallback, useEffect, useState} from 'react';
import {useParams} from "react-router";
import CardPreview from "../components/CardPreview";
import uuid from "react-uuid";
import {fromNear} from "../components/BuyButton";

function AccountPage(props) {
  const { accountId } = useParams();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cardIds, setCardsIds] = useState([]);
  const [gkey] = useState(uuid());

  const fetchCards = useCallback(async () => {
    const account = await props._near.getAccount(accountId);
    if (!account) {
      return;
    }
    setAccount(account);
    return await account.fetchCards();
  }, [props._near, accountId])

  useEffect(() => {
    if (props.connected) {
      fetchCards().then((cardIds) => {
        setCardsIds(cardIds);
        setLoading(false);
      })
    }
  }, [props.connected, fetchCards])

  const cards = cardIds.map((cardId) => {
    const key = `${gkey}-${cardId}`;
    return (
      <CardPreview {...props} key={key} cardId={cardId} />
    );
  })

  return (
    <div className="container">
      <div className="row justify-content-md-center">
        {loading ? (
          <div className="col">
            <div className="d-flex justify-content-center">
              <div className="spinner-grow" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="col ">
            <h3>{accountId === props.signedAccountId ? "Your cards" : `Cards owned by @${accountId}`}</h3>
            <div>
              {cards}
            </div>
          </div>
        )}
        {!account ? (
          <div className="col col-12 col-lg-8 col-xl-6">
            <div className="d-flex justify-content-center">
              <div className="spinner-grow" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="col col-12 col-lg-4 col-xl-4">
            <h3>Stats</h3>
            <p>
              <ul>
                <li>Card owned: {account.numCards}</li>
                <li>Purchase volume: {account.purchaseVolume.toFixed(2)} NEAR</li>
                <li>Num purchases: {account.numPurchases}</li>
                <li>Sale profit: {account.saleProfit.toFixed(2)} NEAR</li>
                <li>Num sales: {account.numSales}</li>
                <li>Num votes: {account.numVotes}</li>
              </ul>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AccountPage;