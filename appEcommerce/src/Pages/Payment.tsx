import '../Styles/MainGeneral.css';
import { useState, useEffect, useMemo, type ChangeEvent } from 'react';
import api from '../Services/Api';
import { Link, useNavigate } from 'react-router-dom';
import BagFooterGeneral from '../Components/BagFooterGeneral';

import '../Styles/PaymentStyle/PaymentMain.css';
import '../Styles/Footer.css';
import '../Styles/Erro.css';

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

function Payment() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<ProductInItems[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 1. Estado para os valores dos inputs
    const [formData, setFormData] = useState({
        numero: '',
        nome: '',
        validade: '',
        cvv: ''
    });

    // 2. Estado para os erros (booleano)
    const [errors, setErrors] = useState({
        numero: false,
        nome: false,
        validade: false,
        cvv: false
    });

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

    // 3. Função para atualizar os dados enquanto o usuário digita
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Limpa o erro assim que o usuário começa a corrigir o campo
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: false }));
        }
    };

    // 4. Lógica de validação
    const validateFields = () => {
        const newErrors = {
            numero: formData.numero.replace(/\s/g, '').length < 13, // Mínimo para cartões reais
            nome: formData.nome.trim().length < 3,
            validade: !/^\d{2}\/\d{2}$/.test(formData.validade), // Formato 00/00
            cvv: formData.cvv.length < 3
        };

        setErrors(newErrors);
        
        // Retorna true se todos os campos forem falsos (sem erros)
        return !Object.values(newErrors).some(err => err === true);
    };

    const handleFollowPayment = (e: React.MouseEvent) => {
        const isValid = validateFields();
        
        if (!isValid) {
            e.preventDefault(); // Impede o <Link> de navegar
            return;
        }

        const event = new CustomEvent('updateHeader', { detail: 'confirmation' });
        window.dispatchEvent(event);
    };

    return (
        <>
            <main className="containerMain">
                <section className='infoMain' id='infoMainPayment'>
                    
                    {loading && <div className="loadingMessage">Carregando sua sacola...</div>}
                    {error && <div className="errorMessage">{error}</div>}
                    {products.length === 0 && !loading && !error && <div className="emptyBag">Sua sacola está vazia.</div>}

                    <form className='FormInfoPayment' noValidate>
                        <h1 id='paymentTitle'>Cartão de Crédito</h1>

                        <div className='DetailPayment'>
                            <h2 className='textPaymentGeneral'>Número</h2>
                            <input 
                                type="text" 
                                name="numero"
                                className={`inputFormPayment ${errors.numero ? 'inputError' : ''}`} 
                                placeholder='0000 0000 0000 0000' 
                                onChange={handleChange}
                            />
                            <span className={`infoHidden ${errors.numero ? 'active' : 'desactive'}`}>
                                Insira um número de cartão válido
                            </span>
                        </div>

                        <div className='DetailPayment'>
                            <h2 className='textPaymentGeneral'>Nome do titular do cartão</h2>
                            <input 
                                type="text" 
                                name="nome"
                                className={`inputFormPayment ${errors.nome ? 'inputError' : ''}`} 
                                placeholder='Nome impresso no cartão'
                                onChange={handleChange}
                            />
                            <span className={`infoHidden ${errors.nome ? 'active' : 'desactive'}`}>
                                Insira um nome válido
                            </span>
                        </div>

                        <div className='DetailPayment' id='detailPaymentSecurity'>
                            <div>
                                <h2 className='textPaymentGeneral'>Data de validade</h2>
                                <input 
                                    type="text" 
                                    name="validade"
                                    className={`inputFormPayment ${errors.validade ? 'inputError' : ''}`} 
                                    placeholder='MM/AA'
                                    onChange={handleChange}
                                />
                                <span className={`infoHidden ${errors.validade ? 'active' : 'desactive'}`}>
                                    Insira uma data válida
                                </span>
                            </div>
                            <div>
                                <h2 className='textPaymentGeneral'>Código CVV</h2>
                                <input 
                                    type="text" 
                                    name="cvv"
                                    className={`inputFormPayment ${errors.cvv ? 'inputError' : ''}`} 
                                    placeholder='000'
                                    onChange={handleChange}
                                />
                                <span className={`infoHidden ${errors.cvv ? 'active' : 'desactive'}`}>
                                    Insira um CVV válido
                                </span>
                            </div>
                        </div>
                    </form>
                </section>
            </main>
            <footer className='containerFooter'>
                <div className='returnSinteticBag'>
                    <BagFooterGeneral products={products} />
                    <Link to={'/confirmation'} onClick={handleFollowPayment} className="btnPayment buttonFollow">
                        Seguir para o Pagamento
                    </Link>
                </div>
            </footer>
        </>
    );
}

export default Payment;