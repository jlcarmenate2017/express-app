import React, {useEffect, useState} from 'react';
import SecondWindow from "./SecondWindow";


const App = () => {
    const [ticket, setTicket] = useState({
        currency: undefined
    });
    useEffect(() => {
        addEventListener("message", ev => {
            if (ev && ev.data && ev.data.backend && ev.data.event === 'ticket_changed') {
                setTicket(ev.data.data);
            }
        });
    }, []);

    const chainImage = "path/to/chain/logo.png"; // Replace with actual image path

    return <SecondWindow ticket={ticket} chainImage={chainImage} smallVideo={undefined} defaultCurrency={ticket.currency} />;
}

export default App;