import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';

import { useCartContext } from '../../../context/cart';

export const useProductListing = props => {
    const {
        queries: { getProductListing }
    } = props;

    const [{ cartId }] = useCartContext();
    const [activeEditItem, setActiveEditItem] = useState(null);

    const [
        fetchProductListing,
        { called, data, error, loading }
    ] = useLazyQuery(getProductListing);

    useEffect(() => {
        if (cartId) {
            fetchProductListing({
                variables: {
                    cartId
                }
            });
        }
    }, [cartId, fetchProductListing]);

    useEffect(() => {
        if (error) {
            console.error(error);
        }
    }, [error]);

    let items = [];
    if (called && !error && !loading) {
        data.cart.items.map(item => {
            item.product.uri = `/${item.product.url_key}${data.storeConfig.product_url_suffix}`
        })

        items = data.cart.items;
    }

    return {
        activeEditItem,
        isLoading: !!loading,
        items,
        setActiveEditItem
    };
};
