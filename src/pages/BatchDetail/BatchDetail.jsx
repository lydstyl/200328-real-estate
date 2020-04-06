import React, { useState } from 'react';
import { useStoreState } from 'easy-peasy';

import { useParams } from 'react-router-dom';

export const BatchDetail = () => {
  const { id } = useParams();

  const { lessors } = useStoreState((state) => state.lessor);
  const { tenants } = useStoreState((state) => state.tenant);
  const { batches, terms } = useStoreState((state) => state.batch);

  const batch = batches.filter((batch) => batch.id === id)[0];
  const {
    lid,
    tid,
    charge,
    balance, // must be editable
    rent,
    // beginDate, paymentDeadline
  } = batch;

  const lessor = lessors.filter((lessor) => lessor.id === lid)[0];
  const tenant = tenants.filter((tenant) => tenant.id === tid)[0];

  const {
    companyName,
    managerFirstName,
    managerLastName,
    address1,
    address2,
    postalCode,
    townName,
  } = lessor;

  const { civility, firstName, lastName } = tenant;

  const docPlace = 'Raismes';

  const [dates, setDates] = useState({
    docDate: terms[0].rentReceiptDate.stringFr,
    termFrom: terms[0].termFrom.stringFr,
    termTo: terms[0].termTo.stringFr,
  });
  const [csBalance, setCsBalance] = useState(balance); // component state balance

  const onCsBalanceChange = (e) => {
    setCsBalance(parseFloat(e.target.value));
  };

  const handleTermChange = (e) => {
    const value = JSON.parse(e.target.value);

    setDates({
      docDate: value.rentReceiptDate.stringFr,
      termFrom: value.termFrom.stringFr,
      termTo: value.termTo.stringFr,
    });
  };
  return (
    <div className='container'>
      <form className='row no-print'>
        <div className='input-field col s6'>
          <input
            onChange={onCsBalanceChange}
            name='balance'
            id='balance'
            type='number'
            className='validate'
            value={csBalance}
          />
          <label htmlFor='balance'>Solde antérieur</label>
        </div>

        {/* <div className='input-field col s6'>
          <input name='docDate' id='docDate' type='date' className='validate' />
          <label htmlFor='docDate'>Date du document</label>
        </div> */}

        <div className='col s6'>
          <div className='input-fiel'>
            <div>
              <label>Bailleur</label>

              <select
                onChange={handleTermChange}
                name='term'
                style={{ display: 'block' }}
              >
                {terms.map((term) => (
                  <option key={term.id} value={JSON.stringify(term)}>
                    {`${term.termFrom.stringFr} ${term.termTo.stringFr}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className='input-field col s6'>
          <button
          // onClick={handleChange}
          >
            Sauver le solde et le document de ce lot
          </button>
        </div>
      </form>

      <div className=' due-notice'>
        <div className='row sender'>
          <p>
            {companyName
              ? companyName
              : managerFirstName + ' ' + managerLastName}
          </p>
          <p>{address1}</p>
          {address2 && <p>{address2}</p>}
          <p>
            {postalCode} {townName}
          </p>
        </div>

        <div className='row recipient'>
          <p>
            {civility} {firstName} {lastName}
          </p>
          <p>{batch.address1}</p>
          <p>{batch.address2}</p>
          <p>
            {batch.postalCode} {batch.townName}
          </p>
        </div>

        <div className='row where-when'>
          à <span>{docPlace}</span>, le <span>{dates && dates.docDate}</span>
        </div>

        <h1 className='row'>Avis d'échéance</h1>

        <div className='row amount-to-pay'>
          <p>
            Somme à payer sur le terme du {dates && dates.termFrom} au{' '}
            {dates && dates.termTo}.
          </p>

          <ul>
            <li>Solde antérieur: {csBalance}</li>
            <li>Loyer nu : {rent}</li>
            <li>Charges: {charge}</li>
            <li>Total à payer : {csBalance + rent + charge} €</li>
          </ul>
        </div>

        <div className='row footer'>
          <p>Cet avis ne peut en aucun cas faire office de quittance.</p>
          <p>
            Le gérant de {companyName}, {managerFirstName} {managerLastName}
          </p>
        </div>
      </div>
    </div>
  );
};
