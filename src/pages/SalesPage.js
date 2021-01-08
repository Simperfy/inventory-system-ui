import React from 'react';

import {Modal} from '../components';
import MainLayout from '../layout/MainLayout';
import MainFormLayoutSales from '../layout/MainFormLayoutSales';
import {withRouter} from 'react-router-dom';
import {SalesContext} from '../context/SalesContext';
import {AppContext} from '../context/AppContext';
import {AbstractPage} from './AbstractPage';
import PendingItemsLayout from '../layout/PendingItemsLayout';
import pendingItemTypes from '../enums/enumPendingItemTypes';
// import enumKiloType from '../enums/enumKiloType';
// import enumFormTypes from '../enums/enumFormTypes';
import {connect} from 'react-redux';
import {updateSearchResults} from '../actions/searchResultsActions';
import {updateSuppliers} from '../actions/suppliersActions';
import {updateSacks, updateSackSelectedId} from '../actions/sacksActions';
import {addPendingSalesItem, removeAllPendingItems} from '../actions/pendingItemsActions';
import {updatePrice, updatePriceBySackId} from '../actions/priceActions';
import {resetQuantity, updateQuantity} from '../actions/quantityActions';
import {updateItemBarcode, updateItemPrice, updateItemRemaining, updateItemText} from '../actions/itemActions';
import {updateKiloBySackId} from '../actions/kiloActions';
import {enumSubmitConfirmTypes} from '../enums/enumSubmitConfirmTypes';
import formTypes from '../enums/enumFormTypes';

class SalesPage extends AbstractPage {
  static contextType = AppContext;

  addPendingItems = () => {
    // if (!this.isValidFormSales()) return;
    if (!this.removeDuplicate()) return;

    const item = {
      name: this.props.itemText,
      barcode: this.props.itemBarcode,
      quantity: this.props.quantity,
      kilo: this.props.kilo,
      discount: this.props.discount,
      price: this.props.price,
    };

    this.props.addPendingSalesItem(item);

    this.closeForm();
    this.resetForm();
  };

  handleSearchBarItemClick = (res) => {
    const itemText = res.name;
    const itemBarcode = res.id;
    const suppliers = res.suppliers;
    const sacks = res.sacks;
    const price = res.price;
    const remaining = res.remaining;
    const formType = res.kiloAble ? formTypes.salesPerKilo : formTypes.salesPerQuantity;

    this.addOpacityBlur();

    this.closeSearchResults();
    this.resetForm();

    console.log('newFormValue');
    console.log(res);

    this.props.updateItemText(itemText);
    this.props.updateItemBarcode(itemBarcode);
    this.props.updateItemPrice(price); // retain item kilo/qty price
    this.props.updateSuppliers(suppliers);
    this.props.updateItemRemaining(remaining);
    this.props.updateSacks(sacks);
    this.props.updatePrice(price);

    this.setState((prevState, props) => {
      return {
        // @TODO FORM TYPE MUST BE INCLUDED IN REDUX BEFORE REMOVING THIS
        mainForm: {
          ...prevState.mainForm,
          ...res,
        },
      };
    });

    this.showForm(formType);
  };

  componentDidMount() {
    this.props.removeAllPendingItems(false);
  }

  render() {
    return (
      <SalesContext.Provider
        value={this.providerFunctions()}
      >
        <MainLayout type="sales">
          <div className="container-fluid">
            <div className="row h-100 pb-4">
              <div className="col-md-8">
                <MainFormLayoutSales />
              </div>
              <div className="col-md-4">
                <PendingItemsLayout
                  setState={this.setState.bind(this)}
                  pendingItemTypes={pendingItemTypes.sales}
                />
              </div>
            </div>
          </div>
        </MainLayout>
        {this.state.isConfirming && <Modal.ModalConfirm
          handleSubmitConfirm={() => this.handleSubmitConfirm(enumSubmitConfirmTypes.SALES_SUBMIT)}
          submitConfirmType={enumSubmitConfirmTypes.SALES_SUBMIT}
          setState={this.context.setState.bind(this)}
          confirmItems={this.props.pendingItems.map((pi) => ({id: pi.id, leftText: `${pi.quantity} x ${pi.name} ${pi.kilo > 0 ? `(${pi.kilo} kg)` : ''}`, rightText: '₱'+pi.price}))}
        />}
        {this.state.isLoading && <Modal.ModalLoading />}
        {this.state.isSuccess && <Modal.ModalSuccess handleClick={this.handleModalSuccessClick} />}
        {this.state.isFailed && <Modal.ModalFailed handleClick={() => this.handleModalFailedClick(enumSubmitConfirmTypes.SALES_SUBMIT)} handleClose={this.handleModalFailedClose}/>}
      </SalesContext.Provider>
    );
  }
}

export default withRouter(connect((state) => ({
  pendingItems: state.pending.pendingItems,
  quantity: state.quantity,
  sacks: state.sacksStore.sacks,
  itemText: state.item.text,
  itemBarcode: state.item.barcode,
  kilo: state.kilo,
  discount: state.discount,
  price: state.price,
  searchResults: state.searchResults,
}), {
  addPendingSalesItem,
  updateSearchResults,
  updateSuppliers,
  updateSacks,
  updateSackSelectedId,
  updatePrice,
  resetQuantity,
  updateQuantity,
  updateItemText,
  updateItemBarcode,
  updateItemPrice,
  updateKiloBySackId,
  updatePriceBySackId,
  removeAllPendingItems,
  updateItemRemaining,
},
)(SalesPage));
