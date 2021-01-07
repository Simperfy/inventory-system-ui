import React from 'react';

import {Form} from '../index';

import {InventoryContext} from '../../context/InventoryContext';

import './FormGroup.css';

class FormGroupInventorySack extends React.Component {
  static contextType = InventoryContext;

  render() {
    const {
      suppliers,
      itemText,
      itemBarcode,
      supplierId,
      sacks,
      quantity,
      kilo,
    } = this.context.state.mainForm;

    return (
      <div className="row form-group-container" ref={this.context.state.formGroupRef}>
        <div className="col-md-6">
          <div className="d-flex flex-column main-form">
            <Form.FormStaticText text={itemText} textBelow={itemBarcode} />
            <Form.FormInput
              value={quantity}
              formType="number"
              onChange={this.context.handleQuantityInputChange}
              label={'Qty'}
              placeHolder={'1 pcs'}
              min="1"
              hideZero
            />
            <Form.FormSelect
              value={kilo}
              onChange={this.context.handleSackSelectChange}
              label={'Sack'}
              options={sacks.map((s) => ({id: s.sackId, value: s.sackValue, name: s.sackLabel}))}
            />
            <Form.FormSelect
              value={supplierId}
              onChange={this.context.handleSupplierSelectChange}
              label={'Supplier'}
              options={suppliers.map((s) => ({id: s.id, value: s.id, name: s.supplierName}))}
            />
            <div className="form-btn-group">
              <Form.FormButton
                color="blue"
                solid
                text="Add"
                handleClick={this.context.addPendingItems}
              />
              <Form.FormButton
                color="red"
                text="Cancel"
                handleClick={this.context.closeForm}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default FormGroupInventorySack;
