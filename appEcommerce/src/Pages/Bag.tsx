import { useState, useEffect, useMemo } from 'react';
import api from '../Services/Api';
import { Link } from 'react-router-dom';
import BagFooterGeneral from '../Components/BagFooterGeneral';

import '../Styles/MainGeneral.css';
import '../Styles/Footer.css';
import '../Styles/Erro.css';
import '../Styles/BagStyle/BagMain.css';

import creme from '../Images/Products/Mascara Facial.png';
import mascara from '../Images/Products/Mascara de Reconstrução.png';
import perfume from '../Images/Products/Perfume Feminino.png';

interface ProductInItems {
    id: string;
    nm_product: string;
    description: string;
    gross_amount: string;
    fee_amount: string;
    shipping: string;
    qtd: string;
}

interface BagResponse {
    id: string;
    total_gross_amount: string;
    total_net_amount: string;
    items: string;
}

const localImageMap: { [key: string]: string } = {
    "Mascara Facial": creme,
    "Mascara de Reconstrução": mascara,
    "Perfume Feminino": perfume,
};

function Bag() {
    const [products, setProducts] = useState<ProductInItems[]>([]);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    let loadingBag = null
    let loadingBagEmpty = null
    let erroBag = null

    useEffect(() => {
        const fetchBag = async () => {
            try {
                setError(null);
                setLoading(true);
                const response = await api.get('/bags');
                const data: BagResponse[] = response.data;

                if (data && data.length > 0) {
                    const bagObject = data[0];
                    const parsedItems: ProductInItems[] = JSON.parse(bagObject.items);
                    setProducts(parsedItems);
                } else {
                    setProducts([]);
                }
            } catch (err) {
                setError("Não foi possível carregar sua sacola.");
            } finally {
                setLoading(false);
            }
        };

        fetchBag();
    }, []);


    if (error) erroBag = <div className="errorMessage">{error}</div>;

    if (loading) loadingBag = <div className="loadingMessage">Carregando sua sacola...</div>;


    if (products.length === 0 && error?.length === 0) loadingBagEmpty = <div className="emptyBag">Sua sacola está vazia.</div>;

    const handleFollowPayment = () => {
        const event = new CustomEvent('updateHeader', { detail: 'payment' });
        window.dispatchEvent(event);
    };

    return (
        <>
            <main className="containerMain">

                <section className='infoMain' id='infoMainBag'>

                    <div className='infoProduct'>

                        <div className='errorMessage'>{loadingBag}{loadingBagEmpty}{erroBag}</div>
                        
                        
                        {products.map((item) => {

                            const imageSrc = localImageMap[item.nm_product] || '';

                            // formata de acordo com a moeda
                            const priceFormatted = new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                            }).format(Number(item.gross_amount));

                            return (

                                <div key={item.id} className='productItem'>

                                    <img className='productsImg' src={imageSrc} alt={item.nm_product} />
                                    
                                    <p className='productDescription'>{item.description}</p>
                                    
                                    <p className='productPrice'>{priceFormatted}</p>
                                
                                </div>
                            );
                        })}
                    </div>
                </section>
            </main>
            <footer className='containerFooter'>
                <div className='returnSinteticBag'>

                    {/* utiliza o componente padrão do footer */}
                    <BagFooterGeneral products={products} />

                    <Link to={'/payment'} onClick={handleFollowPayment} className="btnPayment buttonFollow">
                        Seguir para o Pagamento
                    </Link>
                </div>
            </footer>
        </>
    );
}

export default Bag;