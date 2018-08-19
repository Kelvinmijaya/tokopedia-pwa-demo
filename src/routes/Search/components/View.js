import React, { Component } from "react";
import { connect } from "react-redux";
import { func, bool, arrayOf, object, string } from "prop-types";

import { getSearchProduct } from "../../../modules/Search";
import ProductCard from "../../../components/ProductCard";
import { ProductWrap, ProductRow, LoadMore, CenterText } from "./style";

class SearchView extends Component {
  static propTypes = {
    data: arrayOf(object),
    error: string.isRequired,
    getSearchProduct: func.isRequired,
    loading: bool.isRequired,
    pagination: object.isRequired,
    query: string.isRequired
  };

  static defaultProps = {
    data: []
  };

  componentDidMount() {
    const { query, getSearchProduct, data } = this.props;
    if (data.length === 0) {
      getSearchProduct(query, 1);
    }
  }

  fetchMore = () => {
    const { pagination, query, getSearchProduct } = this.props;
    const page = pagination.current || 0;

    getSearchProduct(query, page + 1);
  };

  render() {
    const { data, loading, pagination, error } = this.props;
    
    if (loading && data.length === 0) {
      return (
        <ProductWrap>
          <CenterText>Loading..</CenterText>
        </ProductWrap>
      );
    }

    if (data.length === 0 && error === "") {
      return (
        <ProductWrap>
          <CenterText>Product Not Found</CenterText>
        </ProductWrap>
      );
    }

    return (
      <ProductWrap>
        {data.length > 0 &&
          data.map((product, index) => {
            const {
              id,
              name,
              slug,
              brand,
              price,
              imageUrl,
              codeitem,
              variant
            } = product;

            return (
              <ProductRow key={`productRow${index}`}>
                <ProductCard
                  id={id}
                  name={name}
                  slug={slug}
                  brand={brand}
                  price={price}
                  imageUrl={imageUrl}
                  codeitem={codeitem}
                  variant={variant}
                />
              </ProductRow>
            );
          })}
        {pagination.next && (
          <LoadMore onClick={this.fetchMore}>
            {loading ? "Loading.." : "Load More"}
          </LoadMore>
        )}
      </ProductWrap>
    );
  }
}

const mapStateToProps = ({ search }) => ({
  query: search.query,
  loading: search.productRequest,
  data: search.product,
  pagination: search.pagination,
  error: search.productError
});

export default connect(
  mapStateToProps,
  { getSearchProduct }
)(SearchView);
