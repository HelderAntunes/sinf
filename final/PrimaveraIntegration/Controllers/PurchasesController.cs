using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using PrimaveraIntegration.Lib_Primavera.Model;

namespace PrimaveraIntegration.Controllers
{
    public class PurchasesController : ApiController
    {
        // GET api/purchases   
        public IEnumerable<Lib_Primavera.Model.Purchase> GetPurchases()
        {
            return Lib_Primavera.PriIntegration.GetAllPurchases(null, null);
        }
        
        // GET api/purchases   
        public IEnumerable<Lib_Primavera.Model.Purchase> GetPurchases(String id)
        {
            if (id == "groupByDate"){
                return Lib_Primavera.PriIntegration.GetAllPurchasesGroupedByDate(null, null);
            }
            if (id == "groupBySupplier"){
                return Lib_Primavera.PriIntegration.GetAllPurchasesGroupedBySupplier(null, null);
            }
            if (id == "notPayed")
            {
                return Lib_Primavera.PriIntegration.GetNotPayedPurchases();
            }
            else{
                return Lib_Primavera.PriIntegration.GetAllPurchasesOfAProduct(id);
            }
        }

        // GET api/purchases/id?year={year}
        public IEnumerable<Lib_Primavera.Model.Purchase> GetPurchases(String id, int year)
        {
            if (id == "groupByDate")
            {
                return Lib_Primavera.PriIntegration.GetAllPurchasesGroupedByDate(year.ToString(), null);
            }
            if (id == "groupBySupplier")
            {
                return Lib_Primavera.PriIntegration.GetAllPurchasesGroupedBySupplier(year.ToString(), null);
            }
            else
            {
                return Lib_Primavera.PriIntegration.GetAllPurchases(year.ToString(), null);
            }
        }

        // GET api/purchases/id?year={year}&month={month}
        public IEnumerable<Lib_Primavera.Model.Purchase> GetPurchases(String id, int year, int month)
        {
            if (id == "groupByDate"){
                return Lib_Primavera.PriIntegration.GetAllPurchasesGroupedByDate(year.ToString(), month.ToString());
            }
            if (id == "groupBySupplier"){
                return Lib_Primavera.PriIntegration.GetAllPurchasesGroupedBySupplier(year.ToString(), month.ToString());
            }
            else{
                return Lib_Primavera.PriIntegration.GetAllPurchases(year.ToString(), month.ToString());
            } 
        }

        // GET api/purchases/date/{year}
        public IEnumerable<Lib_Primavera.Model.Purchase> GetPurchases(int year)
        {
            return Lib_Primavera.PriIntegration.GetAllPurchases(year.ToString(), null);
        }

        // GET api/purchases/date/{year}/{month}
        public IEnumerable<Lib_Primavera.Model.Purchase> GetPurchases(int year, int month)
        {
            return Lib_Primavera.PriIntegration.GetAllPurchases(year.ToString(), month.ToString());
        }

        // GET api/purchases?initial={yyyy-mm-dd}&final={yyyy-mm-dd}
        public IEnumerable<Lib_Primavera.Model.Purchase> GetPurchases(DateTime initial, DateTime final)
        {
            return Lib_Primavera.PriIntegration.GetAllPurchases(initial.ToString("yyyy-MM-dd"), final.ToString("yyyy-MM-dd"), null);
        }

        // GET api/purchases?initial={yyyy-mm-dd}&final={yyyy-mm-dd}&supplier={supplier}
        public IEnumerable<Lib_Primavera.Model.Purchase> GetPurchases(DateTime initial, DateTime final, string supplier)
        {
            return Lib_Primavera.PriIntegration.GetAllPurchases(initial.ToString("yyyy-MM-dd"), final.ToString("yyyy-MM-dd"), supplier);
        }
    }
}
