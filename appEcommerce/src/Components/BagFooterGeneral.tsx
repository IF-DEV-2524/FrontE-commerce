import React, { useMemo } from 'react';

interface ProductInItems {
    id: string;
    nm_product: string; // Nome do produto
    gross_amount: string;
    shipping: string;
    fee_amount: string;
    qtd: string;
}

interface BagFooterProps {
    products: ProductInItems[];
}

const BagFooterGeneral: React.FC<BagFooterProps> = ({ products }) => {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    // Cálculos de totais
    const totals = useMemo(() => {
        return products.reduce((acc, item) => {
            const qtd = Number(item.qtd) || 0;
            const price = Number(item.gross_amount) || 0;
            const shipping = Number(item.shipping) || 0;
            const fee = Number(item.fee_amount) || 0;

            return {
                quantidade: acc.quantidade ++,
                subtotal: acc.subtotal + (price * qtd),
                totalShipping: acc.totalShipping + shipping,
                totalFees: acc.totalFees + fee
            };
        }, { subtotal: 0, totalShipping: 0, totalFees: 0, quantidade: 0 });
    }, [products]);

    const totalFinal = (totals.subtotal + totals.totalShipping) - totals.totalFees;

    return (
            <>
            <div className="summaryRow">
                        <p className='infoSintetic'>Produtos ({totals.quantidade} itens):</p>
                        <span>{formatCurrency(totals.subtotal)}</span>
                    </div>
            <div className="summaryRow">
                <p className="infoSintetic">Frete:</p>
                <span>{formatCurrency(totals.totalShipping)}</span>
            </div>

            <div className="summaryRow">
                <p className="infoSintetic">Descontos:</p>
                <span id="descount">{formatCurrency(totals.totalFees)}</span>
            </div>

            <div className="summaryTotal">
                <strong>Subtotal:</strong>
                <strong>{formatCurrency(totalFinal)}</strong>
            </div>
        </>
    );
};

export default BagFooterGeneral;