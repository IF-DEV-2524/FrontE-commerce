
import '../Styles/MainGeneral.css'
import { useState, useEffect } from 'react';
import api from '../Services/Api';
import { Link } from 'react-router-dom';


import '../Styles/MainGeneral.css';
import '../Styles/Footer.css';
import '../Styles/Erro.css';


function Payment() {

        // Aqui disparamos um evento para modificar o payment e adiicionar o active a classe
    const handleFollowPayment = () => {
        const event = new CustomEvent('updateHeader', { detail: 'confirmation' });
        window.dispatchEvent(event);
    };
    return (
        <>
            <main className="containerMain">
                <section className='infoMain'>
                    <p className='texto'>alternando 2</p>
                </section>
            </main>
                        <footer className='containerFooter'>
                <div className='infoFooter'>
                    <p></p>
                    <p></p>
                </div>

                <div className='infoFooter'>
                    <p></p>
                    <p></p>
                </div>

                <div className='infoFooter'>
                    <p></p>
                    <p></p>
                </div>

                <div className='infoFooter'>
                    <p></p>
                    <p></p>
                </div>

                <Link to={'/confirmation'} onClick={handleFollowPayment}>
                    Finalizar Pedido
                </Link>

            </footer>
        </>
    )
}
export default Payment