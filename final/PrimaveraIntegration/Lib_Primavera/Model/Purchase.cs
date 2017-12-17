using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace PrimaveraIntegration.Lib_Primavera.Model
{
    public class Purchase
    {
        public string Id
        {
            get;
            set;
        }

        public DateTime DocumentDate
        {
            get;
            set;
        }

        public DateTime PaymentDate
        {
            get;
            set;
        }

        public string Entity
        {
            get;
            set;
        }

        public string EntityName
        {
            get;
            set;
        }

        public int DocumentNumber
        {
            get;
            set;
        }

        public string Notes
        {
            get;
            set;
        }

        public double TotalValue
        {
            get;
            set;
        }

        public string DocumentType
        {
            get;
            set;
        }

        public string DocumentSeries
        {
            get;
            set;
        }

        public List<Model.PurchaseItem> Items
        {
            get;
            set;
        }
    }

    public class PurchaseItem
    {
        public string Id
        {
            get;
            set;
        }

        public string Product
        {
            get;
            set;
        }

        public string Description
        {
            get;
            set;
        }

        public double Quantity
        {
            get;
            set;
        }

        public double UnitPrice
        {
            get;
            set;
        }

        public double Value
        {
            get;
            set;
        }
    }
}
