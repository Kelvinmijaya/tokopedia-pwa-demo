import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { object, func, bool, string } from "prop-types";
import { get } from "lodash";

import { getProductFromSearch } from "../../../modules/Product";
import VariantCard from "../../../components/ProductCard/VariantCard";

import {
  ProductDetailWrap,
  ProductImages,
  ProductName,
  ProductPrice,
  ProductInfo,
  BrandName,
  CenterText,
  BuyButton,
  ProductVariant
} from "./style";

class ProductView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      slug: null,
      variantID: 0,
      imageUrl: get(props, "data.imageUrl") || "",
      variantName: ""
    };
  }

  static getDerivedStateFromProps(props, state) {
    // check if this different product from before
    const slug = get(props, "match.params.slug") || "";
    if (slug !== state.slug) {
      return {
        slug,
        variantID: 0,
        imageUrl: "",
        variantName: ""
      };
    }

    // check if variant exist
    if (
      !props.loading &&
      (get(props, "data.variant") || []).length > 0 &&
      state.variantID === 0
    ) {
      return {
        variantID: get(props, "data.variant[0].id") || 0,
        imageUrl:
          get(props, "data.variant[0].imageUrl") || get(props, "data.imageUrl"),
        variantName: get(props, "data.variant[0].name") || ""
      };
    } else if (!props.loading && state.variantID === 0) {
      return {
        imageUrl: get(props, "data.imageUrl")
      };
    }

    return null;
  }

  static propTypes = {
    match: object.isRequired,
    location: object.isRequired,
    history: object.isRequired,
    getProductFromSearch: func.isRequired,
    data: object,
    loading: bool.isRequired,
    error: string.isRequired
  };

  static defaultProps = {
    data: null
  };

  componentDidMount() {
    const { match, getProductFromSearch } = this.props;
    const slug = get(match, "params.slug") || "";

    if (slug !== "") {
      getProductFromSearch(slug);
      this.setState({
        slug,
        variantID: 0,
        imageUrl: "",
        variantName: ""
      });
    }
  }

  changeVariant = variantID => {
    if (this.state.variantID !== variantID) {
      const selected = this.props.data.variant.filter(
        item => item.id === variantID
      );
      if (selected.length > 0) {
        this.setState({
          variantID: selected[0].id || 0,
          imageUrl: selected[0].imageUrl || "",
          variantName: selected[0].name || ""
        });
      }
    }
  };

  render() {
    const { loading, data, error } = this.props;
    const { variantID, imageUrl, variantName } = this.state;

    if (loading && !data) {
      return (
        <ProductDetailWrap>
          <CenterText>Loading..</CenterText>
        </ProductDetailWrap>
      );
    }

    if (!data && error === "") {
      return (
        <ProductDetailWrap>
          <CenterText>Product Not Found</CenterText>
        </ProductDetailWrap>
      );
    }

    const { brand, name, price, variant } = data;

    return (
      <ProductDetailWrap>
        <img className={ProductImages} alt={name} src={imageUrl} />
        <ProductInfo>
          <ProductName>{`${name} ${variantName}`}</ProductName>
          <BrandName>{brand}</BrandName>
          <ProductPrice>{`$ ${price}`}</ProductPrice>
        </ProductInfo>
        {variant.length > 0 && (
          <ProductVariant>
            <ul>
              {variant.map((item, index) => (
                <li key={`variantItem-${index}`}>
                  <VariantCard
                    activeID={variantID}
                    changeVariant={this.changeVariant}
                    id={item.id}
                    active={item.active}
                    color={item.color}
                  />
                </li>
              ))}
            </ul>
          </ProductVariant>
        )}
        <BuyButton>Buy</BuyButton>
      </ProductDetailWrap>
    );
  }
}

const mapStateToProps = ({ product }) => ({
  loading: product.productRequest,
  data: product.data,
  error: product.productError
});

export default withRouter(
  connect(
    mapStateToProps,
    { getProductFromSearch }
  )(ProductView)
);
