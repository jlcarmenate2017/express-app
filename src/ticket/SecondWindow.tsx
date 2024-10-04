import React from 'react';

import "./styles.css";
import numeral from 'numeral';

function formatNumber(value, currency) {
    if (!value) {
        value = '0.00';
    }
    if (!currency) {
        currency = {
            isoName: 'UYU',
            symbol: '$'
        }
    }
    return `${currency.symbol}${numeral(value).format('0,0.00')}`;
}

const TicketHeader = ({ chainImage, cashierName, clientName }) => (
    <div className="ticket-header">
        {chainImage && <div className="status-item chain-logo" style={{backgroundImage: `url(${chainImage})`}}></div>}
        {cashierName && <div className="status-item">CAJERO: <span className="highlight">{cashierName}</span></div>}
        {clientName && <div className="status-item">CLIENTE: <span className="highlight">{clientName}</span></div>}
    </div>
);

const TicketItem = ({item, defaultCurrency}) => (
    <div className="item">
        <div className="item-details">
            <div className="item-detail item-detail-description-row">
                {item.description}
            </div>
            <div className="item-detail item-detail-unit-price">
                <span>{formatNumber(item.totals.unitPriceCurrency, defaultCurrency)}</span>
            </div>
            <div className="item-detail item-detail-quantity">
                <span>{item.quantity}</span>
            </div>
            <div className="item-detail item-detail-discount">
                <span>{formatNumber(item.totals.discountCurrency, defaultCurrency)} ({item.totals.discountPerc}%)</span>
            </div>
            <div className="item-detail item-detail-total-row">
                <span>{formatNumber(item.totals.priceCurrency, defaultCurrency)}</span>
            </div>
        </div>
    </div>
);

const TicketFooter = ({ticket, defaultCurrency}) => (
    <div className="ticket-footer">
        <div className="info-container">
            <div className="info-block">
                <div className="label">SubTotal</div>
                <div className="value">{formatNumber(ticket.total + ticket.totalDiscountCurrency, defaultCurrency)}</div>
            </div>
            <div className="info-block">
                <div className="label">Descuentos Totales</div>
                <div className="value">{formatNumber(ticket.totalDiscountCurrency, defaultCurrency)}</div>
            </div>
            <div className="info-block">
                <div className="label">Total</div>
                <div className="value">{formatNumber(ticket.totalCurrency, defaultCurrency)}</div>
            </div>
        </div>
    </div>
);

const SecondWindow = ({ ticket, chainImage, smallVideo, defaultCurrency }) => (
    <div className={`main-panel ${smallVideo ? 'small-video' : ''}`}>
        <TicketHeader chainImage={chainImage} cashierName={ticket.cashierName} clientName={ticket.client?.fullName} />
        <div className="ticket-body">
            <div className="items-container">
                <div className="item-details-header">
                    <div className="item-detail item-detail-description">
                        Descripción
                    </div>
                    <div className="item-detail item-detail-unit-price">
                        P. Unitario
                    </div>
                    <div className="item-detail item-detail-quantity">
                        Cantidad
                    </div>
                    <div className="item-detail item-detail-discount">
                        Descuento
                    </div>
                    <div className="item-detail item-detail-total">
                        Total
                    </div>
                </div>
                <div className="item-details-body">
                    {ticket.items?.map((item, index) => (
                        <TicketItem key={index} item={item} defaultCurrency={defaultCurrency}/>
                    ))}
                </div>
            </div>
        </div>
        <TicketFooter ticket={ticket} defaultCurrency={defaultCurrency}/>
        <video id="video_player" muted className={`video-player ${smallVideo ? 'small-video' : ''}`}>
            <source src="video/Geopos_Express.mp4" type="video/mp4"/>
        </video>
    </div>
);

export default SecondWindow;