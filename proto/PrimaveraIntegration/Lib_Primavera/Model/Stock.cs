using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PrimaveraIntegration.Lib_Primavera.Model
{
    public class Stock
    {
        public string Article
        {
            get;
            set;
        }

        public string Family
        {
            get;
            set;
        }

        public string SubFamily
        {
            get;
            set;
        }

        public string Description
        {
            get;
            set;
        }

        public string Warehouse
        {
            get;
            set;
        }

        public double CurrentStock
        {
            get;
            set;
        }

        public double ReserveStock
        {
            get;
            set;
        }

        public double UnitPrice
        {
            get;
            set;
        }

        public double TotalValue
        {
            get;
            set;
        }

    }
}