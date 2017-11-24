﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Interop.ErpBS900;
using Interop.StdPlatBS900;
using Interop.StdBE900;
using Interop.GcpBE900;
using ADODB;

namespace PrimaveraIntegration.Lib_Primavera
{
    public class PriIntegration
    {

        # region Inventory
        // base string query = "SELECT DISTINCT Artigo.Familia, Familias.Descricao, Artigo.Artigo, Artigo.Descricao, Artigo.UnidadeBase, Recalculo.PCMedio, Artigo.SubFamilia, Artigo.STKActual, Artigo.TratamentoDim, Recalculo.QuantidadeArm, Recalculo.QuantReservArm, Recalculo.Artigo, Recalculo.Armazem, Recalculo.Localizacao, Recalculo.Lote, Artigo.MovStock FROM (Artigo Artigo LEFT OUTER JOIN tempdb.dbo.##RecalculoStk Recalculo ON Artigo.Artigo=Recalculo.Artigo) LEFT OUTER JOIN Familias Familias ON Artigo.Familia=Familias.Familia WHERE Artigo.TratamentoDim<>1 ORDER BY Artigo.Artigo, Artigo.SubFamilia";
        static double parseNullDouble(StdBELista objList, string key)
        {
            if (objList.Valor(key).GetType().Name == "Double")
            {
                return objList.Valor(key);
            }
            return 0;
        }


        public static List<Lib_Primavera.Model.Stock> getInventoryTest()
        {
            string query = @"SELECT DISTINCT
                Artigo.Familia Familia,
                Familias.Descricao NomeFamilia, 
                Artigo.Artigo Artigo,
                Artigo.Descricao Descricao,
                Artigo.UnidadeBase UnidadeBase,
                Recalculo.PCMedio PCMedio,
                Artigo.SubFamilia SubFamilia,
                Artigo.STKActual STKActual,
                Artigo.TratamentoDim,
                Recalculo.QuantidadeArm Actual,
                Recalculo.QuantReservArm Reserva,
                Recalculo.Artigo rArtigo,
                Recalculo.Armazem Armazem,
                Artigo.TipoArtigo
            FROM (Artigo Artigo LEFT OUTER JOIN tempdb.dbo.##RecalculoStk Recalculo ON Artigo.Artigo=Recalculo.Artigo)
            LEFT OUTER JOIN Familias Familias ON Artigo.Familia=Familias.Familia
            WHERE Artigo.TratamentoDim<>1
            ORDER BY Artigo.Artigo, Artigo.SubFamilia";
            if (PriEngine.InitializeCompany(PrimaveraIntegration.Properties.Settings.Default.Company.Trim(), PrimaveraIntegration.Properties.Settings.Default.User.Trim(), PrimaveraIntegration.Properties.Settings.Default.Password.Trim()) == true)
            {
                DateTime d = new DateTime(2016, 12,31);
                
                PriEngine.Engine.Comercial.Stocks.RecalculoStocks(enumTipoRecalculoCusteio.trcRecalculo, dtData: d, blnArtNecRecalcPCM: false, blnRecalcQtdReservada: false);
                StdBELista objList = PriEngine.Engine.Consulta(query);

                List<Lib_Primavera.Model.Stock> res = new List<Lib_Primavera.Model.Stock>();
                while (!objList.NoFim())
                {
                    Lib_Primavera.Model.Stock stock = new Lib_Primavera.Model.Stock();

                    stock.CurrentStock = parseNullDouble(objList, "Actual");
                    stock.ReserveStock = parseNullDouble(objList, "Reserva");
                    stock.Article = objList.Valor("Artigo");
                    stock.Family = objList.Valor("Familia");
                    stock.SubFamily = objList.Valor("SubFamilia");
                    stock.Description = objList.Valor("TipoArtigo").ToString(); ;//objList.Valor("Descricao"); AND Recalculo.Posto='00'
                    stock.UnitPrice = parseNullDouble(objList, "PCMedio");
                    stock.Warehouse = objList.Valor("Armazem");
                    stock.TotalValue = (stock.ReserveStock + stock.CurrentStock) * stock.UnitPrice;

                    res.Add(stock);
                    objList.Seguinte();
                }
                /*
               objList = PriEngine.Engine.Consulta("Select * from As");
               for(short i = 0; i < objList.NumColunas(); i++)
                   System.Diagnostics.Debug.WriteLine(objList.Nome(i));
               */

                return res;


            }
            else
            {
                return null;
            }

           
        }

        public static List<Lib_Primavera.Model.Stock> getInventoryTotals(int year = 0, int month = 1)
        {
            /*string query = @"SELECT DISTINCT
                Artigo.Familia Familia,
                Familias.Descricao NomeFamilia, 
                Artigo.Artigo Artigo,
                Artigo.Descricao Descricao,
                Artigo.UnidadeBase UnidadeBase,
                Recalculo.PCMedio PCMedio,
                Artigo.SubFamilia SubFamilia,
                Artigo.STKActual STKActual,
                SUM(Recalculo.QuantidadeArm) Actual,
                Artigo.TratamentoDim,
                Recalculo.Artigo rArtigo
            FROM (Artigo Artigo LEFT OUTER JOIN 
                (SELECT PCMedio, SUM(QuantidadeArm) QuantidadeArm, Artigo FROM tempdb.dbo.##RecalculoStk GROUP BY Artigo, PCMedio) Recalculo ON Artigo.Artigo=Recalculo.Artigo)
            LEFT OUTER JOIN Familias Familias ON Artigo.Familia=Familias.Familia
            WHERE Artigo.TratamentoDim<>1
            ORDER BY Artigo.Artigo, Artigo.SubFamilia";*/
            string query = @"SELECT DISTINCT
                Artigo.Familia Familia,
                Familias.Descricao NomeFamilia, 
                Artigo.Artigo Artigo,
                Artigo.Descricao Descricao,
                Artigo.UnidadeBase UnidadeBase,
                Recalculo.PCMedio PCMedio,
                Artigo.SubFamilia SubFamilia,
                Artigo.STKActual STKActual,
                Recalculo.QuantidadeArm Actual,
                Artigo.TratamentoDim,
                Recalculo.Artigo rArtigo
            FROM (Artigo Artigo LEFT OUTER JOIN tempdb.dbo.##RecalculoStk Recalculo ON Artigo.Artigo=Recalculo.Artigo)
            LEFT OUTER JOIN Familias Familias ON Artigo.Familia=Familias.Familia
            WHERE Artigo.TratamentoDim<>1
            ORDER BY Artigo.Artigo, Artigo.SubFamilia";
            if (PriEngine.InitializeCompany(PrimaveraIntegration.Properties.Settings.Default.Company.Trim(), PrimaveraIntegration.Properties.Settings.Default.User.Trim(), PrimaveraIntegration.Properties.Settings.Default.Password.Trim()) == true)
            {
                //Data
                DateTime date;
                if (year != 0)
                {
                    date = new DateTime(year, month, 1);
                }
                else
                {
                    date = DateTime.Now;
                }

                //armazens
                StdBELista armsList = PriEngine.Engine.Consulta("Select Armazem from Armazens");
                string arms = "";
                while (!armsList.NoFim())
                {
                    arms += "[" + armsList.Valor("Armazem") + "]";
                    armsList.Seguinte();
                }

                PriEngine.Engine.Comercial.Stocks.RecalculoStocks(enumTipoRecalculoCusteio.trcRecalculoData, strExtArms: arms, dtData: date, blnArtNecRecalcPCM: false, blnRecalcQtdReservada: false, blnExtRecalculo: false);
                StdBELista objList = PriEngine.Engine.Consulta(query);

                List<Lib_Primavera.Model.Stock> res = new List<Lib_Primavera.Model.Stock>();
                while (!objList.NoFim())
                {
                    Lib_Primavera.Model.Stock stock = new Lib_Primavera.Model.Stock();

                    stock.CurrentStock = parseNullDouble(objList, "Actual");
                    stock.ReserveStock = 0;
                    stock.Article = objList.Valor("Artigo");
                    stock.Family = objList.Valor("NomeFamilia");
                    stock.SubFamily = objList.Valor("SubFamilia");
                    stock.Description = objList.Valor("Descricao");
                    stock.UnitPrice = parseNullDouble(objList, "PCMedio");
                    stock.Warehouse = date.ToString();
                    stock.TotalValue = stock.CurrentStock * stock.UnitPrice;

                    res.Add(stock);
                    objList.Seguinte();
                }


                objList = PriEngine.Engine.Consulta("Select * from ##RecalculoStk");
                System.Diagnostics.Debug.WriteLine(objList.NumLinhas());

                return res;


            }
            else
            {
                return null;
            }


        }

        # endregion


        # region Purchase

        private static string validDocumentSQL = "(TipoDoc='VNC' or TipoDoc like 'VF_' or TipoDoc='VVD') and TipoDoc!='VFS' ";

        public static List<Model.Purchase> GetAllPurchases(string year, string month)
        {
            //Initialize containers
            StdBELista objList;
            StdBELista objListLin;
            List<Model.Purchase> purchaseList = new List<Model.Purchase>();
            Model.Purchase purchase;
            Model.PurchaseItem purchaseItem;

            string query = "SELECT Id, DataDoc, DataVencimento, Entidade, Nome, NumDoc, Observacoes, TotalMerc, TipoDoc, Serie From CabecCompras where " + validDocumentSQL;
            if (year != null)
                query += " and year(DataDoc)=" + year;
            if (month != null)
                query += " and month(DataDoc)=" + month;
            query += " order by DataDoc";
            if (PriEngine.InitializeCompany(PrimaveraIntegration.Properties.Settings.Default.Company.Trim(), PrimaveraIntegration.Properties.Settings.Default.User.Trim(), PrimaveraIntegration.Properties.Settings.Default.Password.Trim()) == true)
            {
                //Select rows from CabecCompras
                objList = PriEngine.Engine.Consulta(query);

                //For every CabecCompras
                while (!objList.NoFim())
                {
                    purchase = new Model.Purchase();

                    purchase.Id = objList.Valor("Id");
                    purchase.DocumentDate = objList.Valor("DataDoc");
                    purchase.PaymentDate = objList.Valor("DataVencimento");
                    purchase.Entity = objList.Valor("Entidade");
                    purchase.EntityName = objList.Valor("Nome");
                    purchase.DocumentNumber = objList.Valor("NumDoc");
                    purchase.Notes = objList.Valor("Observacoes");
                    purchase.TotalValue = objList.Valor("TotalMerc") * (-1);
                    purchase.DocumentType = objList.Valor("TipoDoc");
                    purchase.DocumentSeries = objList.Valor("Serie");
                    purchase.Items = new List<Model.PurchaseItem>();

                    //Select rows from LinhasCompras
                    objListLin = PriEngine.Engine.Consulta("SELECT Id, Artigo, Descricao, Quantidade, Unidade, PrecUnit, TotalILiquido, PrecoLiquido from LinhasCompras where IdCabecCompras='" + purchase.Id + "' order By NumLinha");

                    while (!objListLin.NoFim())
                    {
                        purchaseItem = new Model.PurchaseItem();
                        purchaseItem.Id = objListLin.Valor("Id");
                        purchaseItem.Product = objListLin.Valor("Artigo");
                        purchaseItem.Description = objListLin.Valor("Descricao");
                        purchaseItem.Quantity = objListLin.Valor("Quantidade");
                        purchaseItem.UnitPrice = objListLin.Valor("PrecUnit") *(-1);
                        //purchaseItem.Value = objListLin.Valor("TotalILiquido");
                        purchaseItem.Value = objListLin.Valor("PrecoLiquido") * (-1);
                        purchase.Items.Add(purchaseItem);

                        objListLin.Seguinte();
                    }
                    purchaseList.Add(purchase);
                    objList.Seguinte();

                }

                return purchaseList;
            }
            else
                return null;
        }

        public static List<Model.Purchase> GetAllPurchasesGroupedByDate(string year, string month)
        {
            //Initialize containers
            StdBELista objList;
            List<Model.Purchase> purchaseList = new List<Model.Purchase>();
            Model.Purchase purchase;

            string query = "SELECT DataDoc, SUM(TotalMerc) AS Total From CabecCompras where " + validDocumentSQL;
            if (year != null)
                query += " and year(DataDoc)=" + year;
            if (month != null)
                query += " and month(DataDoc)=" + month;

            query += " GROUP BY DataDoc order by DataDoc";

            if (PriEngine.InitializeCompany(PrimaveraIntegration.Properties.Settings.Default.Company.Trim(), PrimaveraIntegration.Properties.Settings.Default.User.Trim(), PrimaveraIntegration.Properties.Settings.Default.Password.Trim()) == true)
            {
                //Select rows from CabecCompras
                objList = PriEngine.Engine.Consulta(query);

                //For every CabecCompras
                while (!objList.NoFim())
                {
                    purchase = new Model.Purchase();

                    purchase.DocumentDate = objList.Valor("DataDoc");
                    purchase.TotalValue = objList.Valor("Total") * (-1);

                    purchaseList.Add(purchase);
                    objList.Seguinte();

                }

                return purchaseList;
            }
            else
                return null;
        }

        public static List<Model.Purchase> GetAllPurchasesGroupedBySupplier(string year, string month)
        {
            //Initialize containers
            StdBELista objList;
            List<Model.Purchase> purchaseList = new List<Model.Purchase>();
            Model.Purchase purchase;

            string query = "SELECT Entidade, Nome, SUM(TotalMerc) AS Total From CabecCompras where " + validDocumentSQL;
            if (year != null)
                query += " and year(DataDoc)=" + year;
            if (month != null)
                query += " and month(DataDoc)=" + month;

            query += " GROUP BY Entidade, Nome order by Total";

            if (PriEngine.InitializeCompany(PrimaveraIntegration.Properties.Settings.Default.Company.Trim(), PrimaveraIntegration.Properties.Settings.Default.User.Trim(), PrimaveraIntegration.Properties.Settings.Default.Password.Trim()) == true)
            {
                //Select rows from CabecCompras
                objList = PriEngine.Engine.Consulta(query);

                //For every CabecCompras
                while (!objList.NoFim())
                {
                    purchase = new Model.Purchase();

                    purchase.Entity = objList.Valor("Entidade");
                    purchase.EntityName = objList.Valor("Nome");
                    purchase.TotalValue = objList.Valor("Total") * (-1);

                    purchaseList.Add(purchase);
                    objList.Seguinte();

                }

                return purchaseList;
            }
            else
                return null;
        }

        public static List<Model.Purchase> GetAllPurchases(string initial, string final, string supplier)
        {
            //Initialize containers
            StdBELista objList;
            StdBELista objListLin;
            List<Model.Purchase> purchaseList = new List<Model.Purchase>();
            Model.Purchase purchase;
            Model.PurchaseItem purchaseItem;

            string query = "SELECT Id, DataDoc, DataVencimento, Entidade, Nome, NumDoc, Observacoes, TotalMerc, TipoDoc, Serie From CabecCompras where " + validDocumentSQL;
            if (initial != null)
                query += " and DataDoc>='" + initial +"'";
            if (final != null)
                query += " and DataDoc<='" + final + "'";
            if (supplier != null)
                query += " and Entidade='" + supplier + "'";
            query += " order by DataDoc";
            Console.WriteLine(query);

            if (PriEngine.InitializeCompany(PrimaveraIntegration.Properties.Settings.Default.Company.Trim(), PrimaveraIntegration.Properties.Settings.Default.User.Trim(), PrimaveraIntegration.Properties.Settings.Default.Password.Trim()) == true)
            {
                //Select rows from CabecCompras
                objList = PriEngine.Engine.Consulta(query);

                //For every CabecCompras
                while (!objList.NoFim())
                {
                    purchase = new Model.Purchase();

                    purchase.Id = objList.Valor("Id");
                    purchase.DocumentDate = objList.Valor("DataDoc");
                    purchase.PaymentDate = objList.Valor("DataVencimento");
                    purchase.Entity = objList.Valor("Entidade");
                    purchase.EntityName = objList.Valor("Nome");
                    purchase.DocumentNumber = objList.Valor("NumDoc");
                    purchase.Notes = objList.Valor("Observacoes");
                    purchase.TotalValue = objList.Valor("TotalMerc");
                    purchase.DocumentType = objList.Valor("TipoDoc");
                    purchase.DocumentSeries = objList.Valor("Serie");
                    purchase.Items = new List<Model.PurchaseItem>();

                    //Select rows from LinhasCompras
                    objListLin = PriEngine.Engine.Consulta("SELECT Id, Artigo, Descricao, Quantidade, Unidade, PrecUnit, TotalILiquido, PrecoLiquido from LinhasCompras where IdCabecCompras='" + purchase.Id + "' order By NumLinha");

                    while (!objListLin.NoFim())
                    {
                        purchaseItem = new Model.PurchaseItem();
                        purchaseItem.Id = objListLin.Valor("Id");
                        purchaseItem.Product = objListLin.Valor("Artigo");
                        purchaseItem.Description = objListLin.Valor("Descricao");
                        purchaseItem.Quantity = objListLin.Valor("Quantidade");
                        purchaseItem.UnitPrice = objListLin.Valor("PrecUnit");
                        //purchaseItem.Value = objListLin.Valor("TotalILiquido");
                        purchaseItem.Value = objListLin.Valor("PrecoLiquido");
                        purchase.Items.Add(purchaseItem);

                        objListLin.Seguinte();
                    }
                    purchaseList.Add(purchase);
                    objList.Seguinte();

                }

                return purchaseList;
            }
            else
                return null;
        }


        # endregion


        # region Cliente

        public static List<Model.Cliente> ListaClientes()
        {
            
            
            StdBELista objList;

            List<Model.Cliente> listClientes = new List<Model.Cliente>();

            if (PriEngine.InitializeCompany(PrimaveraIntegration.Properties.Settings.Default.Company.Trim(), PrimaveraIntegration.Properties.Settings.Default.User.Trim(), PrimaveraIntegration.Properties.Settings.Default.Password.Trim()) == true)
            {

                //objList = PriEngine.Engine.Comercial.Clientes.LstClientes();

                objList = PriEngine.Engine.Consulta("SELECT Cliente, Nome, Moeda, NumContrib as NumContribuinte, Fac_Mor AS campo_exemplo, CDU_Email as Email FROM  CLIENTES");

                
                while (!objList.NoFim())
                {
                    listClientes.Add(new Model.Cliente
                    {
                        CodCliente = objList.Valor("Cliente"),
                        NomeCliente = objList.Valor("Nome"),
                        Moeda = objList.Valor("Moeda"),
                        NumContribuinte = objList.Valor("NumContribuinte"),
                        Morada = objList.Valor("campo_exemplo"),
                        Email = objList.Valor("Email")
                    });
                    objList.Seguinte();

                }

                return listClientes;
            }
            else
                return null;
        }

        public static Lib_Primavera.Model.Cliente GetCliente(string codCliente)
        {
            

            GcpBECliente objCli = new GcpBECliente();


            Model.Cliente myCli = new Model.Cliente();

            if (PriEngine.InitializeCompany(PrimaveraIntegration.Properties.Settings.Default.Company.Trim(), PrimaveraIntegration.Properties.Settings.Default.User.Trim(), PrimaveraIntegration.Properties.Settings.Default.Password.Trim()) == true)
            {

                if (PriEngine.Engine.Comercial.Clientes.Existe(codCliente) == true)
                {
                    
                    objCli = PriEngine.Engine.Comercial.Clientes.Edita(codCliente);
                    myCli.CodCliente = objCli.get_Cliente();
                    myCli.NomeCliente = objCli.get_Nome();
                    myCli.Moeda = objCli.get_Moeda();
                    myCli.NumContribuinte = objCli.get_NumContribuinte();
                    myCli.Morada = objCli.get_Morada();
                    myCli.Email = PriEngine.Engine.Comercial.Clientes.DaValorAtributo(codCliente, "CDU_Email");

                    
                    return myCli;
                }
                else
                {
                    return null;
                }
            }
            else
                return null;
        }

        public static Lib_Primavera.Model.RespostaErro UpdCliente(Lib_Primavera.Model.Cliente cliente)
        {
            Lib_Primavera.Model.RespostaErro erro = new Model.RespostaErro();
           

            GcpBECliente objCli = new GcpBECliente();

            try
            {

                if (PriEngine.InitializeCompany(PrimaveraIntegration.Properties.Settings.Default.Company.Trim(), PrimaveraIntegration.Properties.Settings.Default.User.Trim(), PrimaveraIntegration.Properties.Settings.Default.Password.Trim()) == true)
                {

                    if (PriEngine.Engine.Comercial.Clientes.Existe(cliente.CodCliente) == false)
                    {
                        erro.Erro = 1;
                        erro.Descricao = "O cliente não existe";
                        return erro;
                    }
                    else
                    {

                        objCli = PriEngine.Engine.Comercial.Clientes.Edita(cliente.CodCliente);
                        objCli.set_EmModoEdicao(true);

                        objCli.set_Nome(cliente.NomeCliente);
                        objCli.set_NumContribuinte(cliente.NumContribuinte);
                        objCli.set_Moeda(cliente.Moeda);
                        objCli.set_Morada(cliente.Morada);
                        
                        PriEngine.Engine.Comercial.Clientes.Actualiza(objCli);

                        erro.Erro = 0;
                        erro.Descricao = "Sucesso";
                        return erro;
                    }
                }
                else
                {
                    erro.Erro = 1;
                    erro.Descricao = "Erro ao abrir a empresa";
                    return erro;

                }

            }

            catch (Exception ex)
            {
                erro.Erro = 1;
                erro.Descricao = ex.Message;
                return erro;
            }

        }


        public static Lib_Primavera.Model.RespostaErro DelCliente(string codCliente)
        {

            Lib_Primavera.Model.RespostaErro erro = new Model.RespostaErro();
            GcpBECliente objCli = new GcpBECliente();


            try
            {

                if (PriEngine.InitializeCompany(PrimaveraIntegration.Properties.Settings.Default.Company.Trim(), PrimaveraIntegration.Properties.Settings.Default.User.Trim(), PrimaveraIntegration.Properties.Settings.Default.Password.Trim()) == true)
                {
                    if (PriEngine.Engine.Comercial.Clientes.Existe(codCliente) == false)
                    {
                        erro.Erro = 1;
                        erro.Descricao = "O cliente não existe";
                        return erro;
                    }
                    else
                    {

                        PriEngine.Engine.Comercial.Clientes.Remove(codCliente);
                        erro.Erro = 0;
                        erro.Descricao = "Sucesso";
                        return erro;
                    }
                }

                else
                {
                    erro.Erro = 1;
                    erro.Descricao = "Erro ao abrir a empresa";
                    return erro;
                }
            }

            catch (Exception ex)
            {
                erro.Erro = 1;
                erro.Descricao = ex.Message;
                return erro;
            }

        }



        public static Lib_Primavera.Model.RespostaErro InsereClienteObj(Model.Cliente cli)
        {

            Lib_Primavera.Model.RespostaErro erro = new Model.RespostaErro();
            

            GcpBECliente myCli = new GcpBECliente();

            try
            {
                if (PriEngine.InitializeCompany(PrimaveraIntegration.Properties.Settings.Default.Company.Trim(), PrimaveraIntegration.Properties.Settings.Default.User.Trim(), PrimaveraIntegration.Properties.Settings.Default.Password.Trim()) == true)
                {

                    myCli.set_Cliente(cli.CodCliente);
                    myCli.set_Nome(cli.NomeCliente);
                    myCli.set_NumContribuinte(cli.NumContribuinte);
                    myCli.set_Moeda(cli.Moeda);
                    myCli.set_Morada(cli.Morada);

                    PriEngine.Engine.Comercial.Clientes.Actualiza(myCli);

                    erro.Erro = 0;
                    erro.Descricao = "Sucesso";
                    return erro;
                }
                else
                {
                    erro.Erro = 1;
                    erro.Descricao = "Erro ao abrir empresa";
                    return erro;
                }
            }

            catch (Exception ex)
            {
                erro.Erro = 1;
                erro.Descricao = ex.Message;
                return erro;
            }


        }

       

        #endregion Cliente;   // -----------------------------  END   CLIENTE    -----------------------


        #region Artigo

        public static Lib_Primavera.Model.Artigo GetArtigo(string codArtigo)
        {
            
            GcpBEArtigo objArtigo = new GcpBEArtigo();
            Model.Artigo myArt = new Model.Artigo();

            if (PriEngine.InitializeCompany(PrimaveraIntegration.Properties.Settings.Default.Company.Trim(), PrimaveraIntegration.Properties.Settings.Default.User.Trim(), PrimaveraIntegration.Properties.Settings.Default.Password.Trim()) == true)
            {

                if (PriEngine.Engine.Comercial.Artigos.Existe(codArtigo) == false)
                {
                    return null;
                }
                else
                {
                    objArtigo = PriEngine.Engine.Comercial.Artigos.Edita(codArtigo);
                    myArt.CodArtigo = objArtigo.get_Artigo();
                    myArt.DescArtigo = objArtigo.get_Descricao();
                    myArt.STKAtual = objArtigo.get_StkActual(); 

                    return myArt;
                }
                
            }
            else
            {
                return null;
            }

        }

        public static List<Model.Artigo> ListaArtigos()
        {
                        
            StdBELista objList;

            Model.Artigo art = new Model.Artigo();
            List<Model.Artigo> listArts = new List<Model.Artigo>();

            if (PriEngine.InitializeCompany(PrimaveraIntegration.Properties.Settings.Default.Company.Trim(), PrimaveraIntegration.Properties.Settings.Default.User.Trim(), PrimaveraIntegration.Properties.Settings.Default.Password.Trim()) == true)
            {

                objList = PriEngine.Engine.Comercial.Artigos.LstArtigos();

                while (!objList.NoFim())
                {
                    art = new Model.Artigo();
                    art.CodArtigo = objList.Valor("artigo");
                    art.DescArtigo = objList.Valor("descricao");
  //                  art.STKAtual = objList.Valor("stkatual");
                  
                    
                    listArts.Add(art);
                    objList.Seguinte();
                }

                return listArts;

            }
            else
            {
                return null;

            }

        }

        #endregion Artigo

   

        #region DocCompra
        

        public static List<Model.DocCompra> VGR_List()
        {
                
            StdBELista objListCab;
            StdBELista objListLin;
            Model.DocCompra dc = new Model.DocCompra();
            List<Model.DocCompra> listdc = new List<Model.DocCompra>();
            Model.LinhaDocCompra lindc = new Model.LinhaDocCompra();
            List<Model.LinhaDocCompra> listlindc = new List<Model.LinhaDocCompra>();

            if (PriEngine.InitializeCompany(PrimaveraIntegration.Properties.Settings.Default.Company.Trim(), PrimaveraIntegration.Properties.Settings.Default.User.Trim(), PrimaveraIntegration.Properties.Settings.Default.Password.Trim()) == true)
            {
                objListCab = PriEngine.Engine.Consulta("SELECT id, NumDocExterno, Entidade, DataDoc, NumDoc, TotalMerc, Serie From CabecCompras where TipoDoc='VGR'");
                while (!objListCab.NoFim())
                {
                    dc = new Model.DocCompra();
                    dc.id = objListCab.Valor("id");
                    dc.NumDocExterno = objListCab.Valor("NumDocExterno");
                    dc.Entidade = objListCab.Valor("Entidade");
                    dc.NumDoc = objListCab.Valor("NumDoc");
                    dc.Data = objListCab.Valor("DataDoc");
                    dc.TotalMerc = objListCab.Valor("TotalMerc");
                    dc.Serie = objListCab.Valor("Serie");
                    objListLin = PriEngine.Engine.Consulta("SELECT idCabecCompras, Artigo, Descricao, Quantidade, Unidade, PrecUnit, Desconto1, TotalILiquido, PrecoLiquido, Armazem, Lote from LinhasCompras where IdCabecCompras='" + dc.id + "' order By NumLinha");
                    listlindc = new List<Model.LinhaDocCompra>();

                    while (!objListLin.NoFim())
                    {
                        lindc = new Model.LinhaDocCompra();
                        lindc.IdCabecDoc = objListLin.Valor("idCabecCompras");
                        lindc.CodArtigo = objListLin.Valor("Artigo");
                        lindc.DescArtigo = objListLin.Valor("Descricao");
                        lindc.Quantidade = objListLin.Valor("Quantidade");
                        lindc.Unidade = objListLin.Valor("Unidade");
                        lindc.Desconto = objListLin.Valor("Desconto1");
                        lindc.PrecoUnitario = objListLin.Valor("PrecUnit");
                        lindc.TotalILiquido = objListLin.Valor("TotalILiquido");
                        lindc.TotalLiquido = objListLin.Valor("PrecoLiquido");
                        lindc.Armazem = objListLin.Valor("Armazem");
                        lindc.Lote = objListLin.Valor("Lote");

                        listlindc.Add(lindc);
                        objListLin.Seguinte();
                    }

                    dc.LinhasDoc = listlindc;
                    
                    listdc.Add(dc);
                    objListCab.Seguinte();
                }
            }
            return listdc;
        }

                
        public static Model.RespostaErro VGR_New(Model.DocCompra dc)
        {
            Lib_Primavera.Model.RespostaErro erro = new Model.RespostaErro();
            

            GcpBEDocumentoCompra myGR = new GcpBEDocumentoCompra();
            GcpBELinhaDocumentoCompra myLin = new GcpBELinhaDocumentoCompra();
            GcpBELinhasDocumentoCompra myLinhas = new GcpBELinhasDocumentoCompra();

            PreencheRelacaoCompras rl = new PreencheRelacaoCompras();
            List<Model.LinhaDocCompra> lstlindv = new List<Model.LinhaDocCompra>();

            try
            {
                if (PriEngine.InitializeCompany(PrimaveraIntegration.Properties.Settings.Default.Company.Trim(), PrimaveraIntegration.Properties.Settings.Default.User.Trim(), PrimaveraIntegration.Properties.Settings.Default.Password.Trim()) == true)
                {
                    // Atribui valores ao cabecalho do doc
                    //myEnc.set_DataDoc(dv.Data);
                    myGR.set_Entidade(dc.Entidade);
                    myGR.set_NumDocExterno(dc.NumDocExterno);
                    myGR.set_Serie(dc.Serie);
                    myGR.set_Tipodoc("VGR");
                    myGR.set_TipoEntidade("F");
                    // Linhas do documento para a lista de linhas
                    lstlindv = dc.LinhasDoc;
                    //PriEngine.Engine.Comercial.Compras.PreencheDadosRelacionados(myGR,rl);
                    PriEngine.Engine.Comercial.Compras.PreencheDadosRelacionados(myGR);
                    foreach (Model.LinhaDocCompra lin in lstlindv)
                    {
                        PriEngine.Engine.Comercial.Compras.AdicionaLinha(myGR, lin.CodArtigo, lin.Quantidade, lin.Armazem, "", lin.PrecoUnitario, lin.Desconto);
                    }


                    PriEngine.Engine.IniciaTransaccao();
                    PriEngine.Engine.Comercial.Compras.Actualiza(myGR, "Teste");
                    PriEngine.Engine.TerminaTransaccao();
                    erro.Erro = 0;
                    erro.Descricao = "Sucesso";
                    return erro;
                }
                else
                {
                    erro.Erro = 1;
                    erro.Descricao = "Erro ao abrir empresa";
                    return erro;

                }

            }
            catch (Exception ex)
            {
                PriEngine.Engine.DesfazTransaccao();
                erro.Erro = 1;
                erro.Descricao = ex.Message;
                return erro;
            }
        }


        #endregion DocCompra


        #region DocsVenda

        public static Model.RespostaErro Encomendas_New(Model.DocVenda dv)
        {
            Lib_Primavera.Model.RespostaErro erro = new Model.RespostaErro();
            GcpBEDocumentoVenda myEnc = new GcpBEDocumentoVenda();
             
            GcpBELinhaDocumentoVenda myLin = new GcpBELinhaDocumentoVenda();

            GcpBELinhasDocumentoVenda myLinhas = new GcpBELinhasDocumentoVenda();
             
            PreencheRelacaoVendas rl = new PreencheRelacaoVendas();
            List<Model.LinhaDocVenda> lstlindv = new List<Model.LinhaDocVenda>();
            
            try
            {
                if (PriEngine.InitializeCompany(PrimaveraIntegration.Properties.Settings.Default.Company.Trim(), PrimaveraIntegration.Properties.Settings.Default.User.Trim(), PrimaveraIntegration.Properties.Settings.Default.Password.Trim()) == true)
                {
                    // Atribui valores ao cabecalho do doc
                    //myEnc.set_DataDoc(dv.Data);
                    myEnc.set_Entidade(dv.Entidade);
                    myEnc.set_Serie(dv.Serie);
                    myEnc.set_Tipodoc("ECL");
                    myEnc.set_TipoEntidade("C");
                    // Linhas do documento para a lista de linhas
                    lstlindv = dv.LinhasDoc;
                    //PriEngine.Engine.Comercial.Vendas.PreencheDadosRelacionados(myEnc, rl);
                    PriEngine.Engine.Comercial.Vendas.PreencheDadosRelacionados(myEnc);
                    foreach (Model.LinhaDocVenda lin in lstlindv)
                    {
                        PriEngine.Engine.Comercial.Vendas.AdicionaLinha(myEnc, lin.CodArtigo, lin.Quantidade, "", "", lin.PrecoUnitario, lin.Desconto);
                    }


                   // PriEngine.Engine.Comercial.Compras.TransformaDocumento(

                    PriEngine.Engine.IniciaTransaccao();
                    //PriEngine.Engine.Comercial.Vendas.Edita Actualiza(myEnc, "Teste");
                    PriEngine.Engine.Comercial.Vendas.Actualiza(myEnc, "Teste");
                    PriEngine.Engine.TerminaTransaccao();
                    erro.Erro = 0;
                    erro.Descricao = "Sucesso";
                    return erro;
                }
                else
                {
                    erro.Erro = 1;
                    erro.Descricao = "Erro ao abrir empresa";
                    return erro;

                }

            }
            catch (Exception ex)
            {
                PriEngine.Engine.DesfazTransaccao();
                erro.Erro = 1;
                erro.Descricao = ex.Message;
                return erro;
            }
        }

     

        public static List<Model.DocVenda> Encomendas_List()
        {
            
            StdBELista objListCab;
            StdBELista objListLin;
            Model.DocVenda dv = new Model.DocVenda();
            List<Model.DocVenda> listdv = new List<Model.DocVenda>();
            Model.LinhaDocVenda lindv = new Model.LinhaDocVenda();
            List<Model.LinhaDocVenda> listlindv = new
            List<Model.LinhaDocVenda>();

            if (PriEngine.InitializeCompany(PrimaveraIntegration.Properties.Settings.Default.Company.Trim(), PrimaveraIntegration.Properties.Settings.Default.User.Trim(), PrimaveraIntegration.Properties.Settings.Default.Password.Trim()) == true)
            {
                objListCab = PriEngine.Engine.Consulta("SELECT id, Entidade, Data, NumDoc, TotalMerc, Serie From CabecDoc where TipoDoc='ECL'");
                while (!objListCab.NoFim())
                {
                    dv = new Model.DocVenda();
                    dv.id = objListCab.Valor("id");
                    dv.Entidade = objListCab.Valor("Entidade");
                    dv.NumDoc = objListCab.Valor("NumDoc");
                    dv.Data = objListCab.Valor("Data");
                    dv.TotalMerc = objListCab.Valor("TotalMerc");
                    dv.Serie = objListCab.Valor("Serie");
                    objListLin = PriEngine.Engine.Consulta("SELECT idCabecDoc, Artigo, Descricao, Quantidade, Unidade, PrecUnit, Desconto1, TotalILiquido, PrecoLiquido from LinhasDoc where IdCabecDoc='" + dv.id + "' order By NumLinha");
                    listlindv = new List<Model.LinhaDocVenda>();

                    while (!objListLin.NoFim())
                    {
                        lindv = new Model.LinhaDocVenda();
                        lindv.IdCabecDoc = objListLin.Valor("idCabecDoc");
                        lindv.CodArtigo = objListLin.Valor("Artigo");
                        lindv.DescArtigo = objListLin.Valor("Descricao");
                        lindv.Quantidade = objListLin.Valor("Quantidade");
                        lindv.Unidade = objListLin.Valor("Unidade");
                        lindv.Desconto = objListLin.Valor("Desconto1");
                        lindv.PrecoUnitario = objListLin.Valor("PrecUnit");
                        lindv.TotalILiquido = objListLin.Valor("TotalILiquido");
                        lindv.TotalLiquido = objListLin.Valor("PrecoLiquido");

                        listlindv.Add(lindv);
                        objListLin.Seguinte();
                    }

                    dv.LinhasDoc = listlindv;
                    listdv.Add(dv);
                    objListCab.Seguinte();
                }
            }
            return listdv;
        }


       

        public static Model.DocVenda Encomenda_Get(string numdoc)
        {
            
            
            StdBELista objListCab;
            StdBELista objListLin;
            Model.DocVenda dv = new Model.DocVenda();
            Model.LinhaDocVenda lindv = new Model.LinhaDocVenda();
            List<Model.LinhaDocVenda> listlindv = new List<Model.LinhaDocVenda>();

            if (PriEngine.InitializeCompany(PrimaveraIntegration.Properties.Settings.Default.Company.Trim(), PrimaveraIntegration.Properties.Settings.Default.User.Trim(), PrimaveraIntegration.Properties.Settings.Default.Password.Trim()) == true)
            {
                

                string st = "SELECT id, Entidade, Data, NumDoc, TotalMerc, Serie From CabecDoc where TipoDoc='ECL' and NumDoc='" + numdoc + "'";
                objListCab = PriEngine.Engine.Consulta(st);
                dv = new Model.DocVenda();
                dv.id = objListCab.Valor("id");
                dv.Entidade = objListCab.Valor("Entidade");
                dv.NumDoc = objListCab.Valor("NumDoc");
                dv.Data = objListCab.Valor("Data");
                dv.TotalMerc = objListCab.Valor("TotalMerc");
                dv.Serie = objListCab.Valor("Serie");
                objListLin = PriEngine.Engine.Consulta("SELECT idCabecDoc, Artigo, Descricao, Quantidade, Unidade, PrecUnit, Desconto1, TotalILiquido, PrecoLiquido from LinhasDoc where IdCabecDoc='" + dv.id + "' order By NumLinha");
                listlindv = new List<Model.LinhaDocVenda>();

                while (!objListLin.NoFim())
                {
                    lindv = new Model.LinhaDocVenda();
                    lindv.IdCabecDoc = objListLin.Valor("idCabecDoc");
                    lindv.CodArtigo = objListLin.Valor("Artigo");
                    lindv.DescArtigo = objListLin.Valor("Descricao");
                    lindv.Quantidade = objListLin.Valor("Quantidade");
                    lindv.Unidade = objListLin.Valor("Unidade");
                    lindv.Desconto = objListLin.Valor("Desconto1");
                    lindv.PrecoUnitario = objListLin.Valor("PrecUnit");
                    lindv.TotalILiquido = objListLin.Valor("TotalILiquido");
                    lindv.TotalLiquido = objListLin.Valor("PrecoLiquido");
                    listlindv.Add(lindv);
                    objListLin.Seguinte();
                }

                dv.LinhasDoc = listlindv;
                return dv;
            }
            return null;
        }

        #endregion DocsVenda
    }
}