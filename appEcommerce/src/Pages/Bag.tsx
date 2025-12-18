import { useState, useEffect, useMemo } from 'react';
import api from '../Services/Api';
import { Link } from 'react-router-dom';

import '../Styles/MainGeneral.css';
import '../Styles/Footer.css';
import '../Styles/Erro.css';
import '../Styles/BagStyle/BagMain.css';
import '../Styles/BagStyle/BagFooter.css';

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

    // Função para formatar valores monetários
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    // Cálculos automáticos baseados no estado 'products'
    const totals = useMemo(() => {
        return products.reduce((acc, item) => {
            const qtd = Number(item.qtd) || 0;
            const price = Number(item.gross_amount) || 0;
            const shipping = Number(item.shipping) || 0;
            const fee = Number(item.fee_amount) || 0;

            return {
                totalItems: acc.totalItems + qtd,
                subtotal: acc.subtotal + (price * qtd),
                totalShipping: acc.totalShipping + shipping,
                totalFees: acc.totalFees + fee
            };
        }, { totalItems: 0, subtotal: 0, totalShipping: 0, totalFees: 0 });
    }, [products]);

    const handleFollowPayment = () => {
        const event = new CustomEvent('updateHeader', { detail: 'payment' });
        window.dispatchEvent(event);
    };

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
                console.error("Erro ao buscar bag:", err);
                setError("Não foi possível carregar sua sacola.");
            } finally {
                setLoading(false);
            }
        };

        fetchBag();
    }, []);

    if (loading) return <div className="loadingMessage">Carregando sua sacola...</div>;
    if (error) return <div className="errorMessage">{error}</div>;
    if (products.length === 0) return <div className="emptyBag">Sua sacola está vazia.</div>;

    return (
        <>
            <main className="containerMain">
                <section className='infoMain' id='infoMainBag'>
                    <div className='infoProduct'>
                        {products.map((item) => {
                            const imageSrc = localImageMap[item.nm_product] || '';

                            // formata de acordo com a moeda
                            const priceFormatted = new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                            }).format(Number(item.gross_amount));

                            return (
                                <div key={item.id} className='productItem'>
                                    <img className='productsImg' src={imageSrc} alt={item.nm_product}
                                    />
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
                    <div className="summaryRow">
                        <p className='infoSintetic'>Produtos ({totals.totalItems} itens):</p>
                        <span>{formatCurrency(totals.subtotal)}</span>
                    </div>

                    <div className="summaryRow">
                        <p className='infoSintetic'>Frete:</p>
                        <span>{formatCurrency(totals.totalShipping)}</span>
                    </div>

                    <div className="summaryRow">
                        <p className='infoSintetic' >Descontos:</p>
                        <span id='descount'>{formatCurrency(totals.totalFees)}</span>
                    </div>

                    <div className="summaryTotal">
                        <strong>Subtotal:</strong>
                        <strong>{formatCurrency((totals.subtotal + totals.totalShipping) - totals.totalFees)}</strong>
                    </div>

                    <Link to={'/payment'} onClick={handleFollowPayment} className="btnPayment buttonFollow">
                        Seguir para o Pagamento
                    </Link>
                </div>
            </footer>
        </>
    );
}

export default Bag;