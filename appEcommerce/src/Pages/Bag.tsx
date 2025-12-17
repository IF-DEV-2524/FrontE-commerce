import { useState, useEffect } from 'react';
import api from '../Services/Api';

import '../Styles/MainGeneral.css';
import '../Styles/Erro.css';
import '../Styles/BagStyle/BagMain.css';

import creme from '../Images/Products/Mascara Facial.png';
import mascara from '../Images/Products/Mascara de Reconstrução.png';
import perfume from '../Images/Products/Perfume Feminino.png';

// 1. Interfaces baseadas no novo retorno
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
    items: string; // O JSON stringificado
}

const localImageMap: { [key: string]: string } = {
    "Mascara Facial": creme,
    "Mascara de Reconstrução": mascara,
    "Perfume Feminino": perfume,
};

function Bag() {
    const [products, setProducts] = useState<ProductInItems[]>([]);
    const [totals, setTotals] = useState<{ gross: string; net: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBag = async () => {
            try {
                setError(null);
                setLoading(true);

                // Chamada para a API
                const response = await api.get('/bags');
                const data: BagResponse[] = response.data;

                // 2. Acesso ao primeiro item do Array [0]
                if (data && data.length > 0) {
                    const bagObject = data[0];

                    // 3. Parse da string 'items' para Array de objetos
                    const parsedItems: ProductInItems[] = JSON.parse(bagObject.items);

                    setProducts(parsedItems);
                    setTotals({
                        gross: bagObject.total_gross_amount,
                        net: bagObject.total_net_amount
                    });
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

    // --- Tratamento de Estados Visuais ---
    if (loading) return <div className="loadingMessage">Carregando sua sacola...</div>;
    if (error) return <div className="errorMessage">{error}</div>;
    if (products.length === 0) return <div className="emptyBag">Sua sacola está vazia.</div>;

    return (
        <main className="containerMain">
            <section className='infoMain' id='infoMainBag'>
                <div className='infoProduct'>
                    {products.map((item) => {
                        const imageSrc = localImageMap[item.nm_product] || '';
                        const priceFormatted = new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                        }).format(Number(item.gross_amount));

                        return (
                            <div key={item.id} className='productItem'>
                                <img
                                    className='productsImg'
                                    src={imageSrc}
                                    alt={item.nm_product}
                                />

                                <p className='productDescription'>{item.description}</p>
                                <p className='productPrice'>{priceFormatted}</p>

                            </div>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}

export default Bag;