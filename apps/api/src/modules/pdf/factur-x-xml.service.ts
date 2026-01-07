import { Injectable } from '@nestjs/common';
import { Invoice, Company, Client, InvoiceItem } from '@prisma/client';

type FullInvoice = Invoice & {
    company: Company & {
        siret?: string;
        vatNumber?: string;
        address?: any;
    };
    client: Client & {
        siret?: string;
        vatNumber?: string;
        address?: any;
    };
    items: InvoiceItem[];
};

@Injectable()
export class FacturXXmlService {

    generateXml(invoice: FullInvoice): string {
        const docId = invoice.invoiceNumber;
        const issueDate = this.formatDate(invoice.issueDate);
        const companyName = this.escapeXml(invoice.company.name);
        const clientName = this.escapeXml(invoice.client.name);

        // Tax Totals
        const taxRate = 20.0; // Simplified for MVP
        const subTotal = invoice.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
        const taxBasis = subTotal;
        const taxAmount = invoice.taxAmount || (subTotal * (taxRate / 100)); // Fallback if taxAmount is also missing
        const totalAmount = invoice.total;

        return `<?xml version="1.0" encoding="UTF-8"?>
<rsm:CrossIndustryInvoice xmlns:rsm="urn:un:unece:uncefact:data:standard:CrossIndustryInvoice:100" xmlns:ram="urn:un:unece:uncefact:data:standard:ReusableAggregateBusinessInformationEntity:100" xmlns:qdt="urn:un:unece:uncefact:data:standard:QualifiedDataType:100" xmlns:udt="urn:un:unece:uncefact:data:standard:UnqualifiedDataType:100">
  <rsm:ExchangedDocumentContext>
    <ram:GuidelineSpecifiedDocumentContextParameter>
      <ram:ID>urn:cen.eu:en16931:2017#compliant#urn:factur-x.eu:1p0:basic</ram:ID>
    </ram:GuidelineSpecifiedDocumentContextParameter>
  </rsm:ExchangedDocumentContext>
  <rsm:ExchangedDocument>
    <ram:ID>${docId}</ram:ID>
    <ram:TypeCode>380</ram:TypeCode>
    <ram:IssueDateTime>
      <udt:DateTimeString format="102">${issueDate}</udt:DateTimeString>
    </ram:IssueDateTime>
  </rsm:ExchangedDocument>
  <rsm:SupplyChainTradeTransaction>
    <ram:IncludedSupplyChainTradeLineItem>
      ${invoice.items.map((item, index) => this.generateLineItem(item, index + 1)).join('\n      ')}
    </ram:IncludedSupplyChainTradeLineItem>
    <ram:ApplicableHeaderTradeAgreement>
      <ram:SellerTradeParty>
        <ram:Name>${companyName}</ram:Name>
        <ram:SpecifiedLegalOrganization>
           <ram:ID schemeID="0002">${invoice.company.siret || 'UNKNOWN'}</ram:ID>
        </ram:SpecifiedLegalOrganization>
        <ram:PostalTradeAddress>
            <ram:PostcodeCode>${(invoice.company.address as any)?.zip || '00000'}</ram:PostcodeCode>
            <ram:LineOne>${this.escapeXml((invoice.company.address as any)?.street || '')}</ram:LineOne>
            <ram:CityName>${this.escapeXml((invoice.company.address as any)?.city || '')}</ram:CityName>
            <ram:CountryID>FR</ram:CountryID>
        </ram:PostalTradeAddress>
        <ram:SpecifiedTaxRegistration>
           <ram:ID schemeID="VA">${invoice.company.vatNumber || ''}</ram:ID>
        </ram:SpecifiedTaxRegistration>
      </ram:SellerTradeParty>
      <ram:BuyerTradeParty>
        <ram:Name>${clientName}</ram:Name>
        <ram:SpecifiedLegalOrganization>
           <ram:ID schemeID="0002">${invoice.client.siret || ''}</ram:ID>
        </ram:SpecifiedLegalOrganization>
         <ram:PostalTradeAddress>
            <ram:PostcodeCode>${(invoice.client.address as any)?.zip || '00000'}</ram:PostcodeCode>
            <ram:LineOne>${this.escapeXml((invoice.client.address as any)?.street || '')}</ram:LineOne>
            <ram:CityName>${this.escapeXml((invoice.client.address as any)?.city || '')}</ram:CityName>
            <ram:CountryID>FR</ram:CountryID>
        </ram:PostalTradeAddress>
         <ram:SpecifiedTaxRegistration>
           <ram:ID schemeID="VA">${invoice.client.vatNumber || ''}</ram:ID>
        </ram:SpecifiedTaxRegistration>
      </ram:BuyerTradeParty>
    </ram:ApplicableHeaderTradeAgreement>
    <ram:ApplicableHeaderTradeDelivery>
    </ram:ApplicableHeaderTradeDelivery>
    <ram:ApplicableHeaderTradeSettlement>
      <ram:InvoiceCurrencyCode>EUR</ram:InvoiceCurrencyCode>
      <ram:ApplicableTradeTax>
        <ram:CalculatedAmount>${taxAmount.toFixed(2)}</ram:CalculatedAmount>
        <ram:TypeCode>VAT</ram:TypeCode>
        <ram:BasisAmount>${taxBasis.toFixed(2)}</ram:BasisAmount>
        <ram:CategoryCode>S</ram:CategoryCode>
        <ram:RateApplicablePercent>${taxRate.toFixed(2)}</ram:RateApplicablePercent>
      </ram:ApplicableTradeTax>
      <ram:SpecifiedTradeSettlementHeaderMonetarySummation>
        <ram:LineTotalAmount>${taxBasis.toFixed(2)}</ram:LineTotalAmount>
        <ram:TaxBasisTotalAmount>${taxBasis.toFixed(2)}</ram:TaxBasisTotalAmount>
        <ram:TaxTotalAmount currencyID="EUR">${taxAmount.toFixed(2)}</ram:TaxTotalAmount>
        <ram:GrandTotalAmount>${totalAmount.toFixed(2)}</ram:GrandTotalAmount>
        <ram:DuePayableAmount>${totalAmount.toFixed(2)}</ram:DuePayableAmount>
      </ram:SpecifiedTradeSettlementHeaderMonetarySummation>
    </ram:ApplicableHeaderTradeSettlement>
  </rsm:SupplyChainTradeTransaction>
</rsm:CrossIndustryInvoice>`;
    }

    private generateLineItem(item: InvoiceItem, index: number): string {
        const netTotal = (item.quantity * item.unitPrice).toFixed(2);
        return `<ram:AssociatedDocumentLineDocument>
        <ram:LineID>${index}</ram:LineID>
      </ram:AssociatedDocumentLineDocument>
      <ram:SpecifiedTradeProduct>
        <ram:Name>${this.escapeXml(item.description)}</ram:Name>
      </ram:SpecifiedTradeProduct>
      <ram:SpecifiedLineTradeAgreement>
        <ram:NetPriceProductTradePrice>
          <ram:ChargeAmount>${item.unitPrice.toFixed(2)}</ram:ChargeAmount>
        </ram:NetPriceProductTradePrice>
      </ram:SpecifiedLineTradeAgreement>
      <ram:SpecifiedLineTradeDelivery>
        <ram:BilledQuantity unitCode="H87">${item.quantity}</ram:BilledQuantity>
      </ram:SpecifiedLineTradeDelivery>
      <ram:SpecifiedLineTradeSettlement>
        <ram:ApplicableTradeTax>
          <ram:TypeCode>VAT</ram:TypeCode>
          <ram:CategoryCode>S</ram:CategoryCode>
          <ram:RateApplicablePercent>20.00</ram:RateApplicablePercent>
        </ram:ApplicableTradeTax>
        <ram:SpecifiedTradeSettlementLineMonetarySummation>
          <ram:LineTotalAmount>${netTotal}</ram:LineTotalAmount>
        </ram:SpecifiedTradeSettlementLineMonetarySummation>
      </ram:SpecifiedLineTradeSettlement>`;
    }

    private formatDate(date: Date): string {
        const d = new Date(date);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}${mm}${dd}`;
    }

    private escapeXml(unsafe: string): string {
        return unsafe.replace(/[<>&'"]/g, c => {
            switch (c) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                case '\'': return '&apos;';
                case '"': return '&quot;';
            }
            return c;
        });
    }
}
