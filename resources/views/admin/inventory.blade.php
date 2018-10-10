@extends('layouts.admin')

@section('title', 'Bot inventory')

@section('content')
    <div class="card">
        <header class="card-header">
            <p class="card-header-title">Inventory</p>
        </header>
        <div class="card-content">
            <table id="table">

            </table>
        </div>
        <footer class="card-footer">
            <div class="card-footer-item">
                Total items: <strong id="inventory-total-items"><i class="fas fa-spinner fa-pulse"></i></strong>
            </div>
            <div class="card-footer-item">
                Total credits: <strong id="inventory-total-credits"><i class="fas fa-spinner fa-pulse"></i></strong>
            </div>
        </footer>
    </div>
@endsection

@section('style')
    <link rel="stylesheet" href="//cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css">
@endsection
@section('script')
    <script src="//cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"></script>

    <script>
        let total_credits, total_items ;
        $(document).ready( function () {
            let datatable = $('#table').DataTable({
                ajax: {
                    url: '/api/Trade/GetSiteItems',
                    dataSrc: function ( json ) {
                        total_credits = total_items = 0
                        const data = [];
                        for ( let key in json.response.items) {
                            data.push(json.response.items[key])
                            total_credits += json.response.items[key].credits
                        }
                        total_items = data.length;
                        return data;
                    }
                },
                columns: [
                    {
                        data: "id",
                        title: "ID",
                        render: function (data, type, row) {
                            return `${data}<br><small>SKU: ${row.sku}</small>`;
                        }
                    },
                    {
                        data: "name",
                        title: "Item",
                        render: function ( data, type, row ) {
                            return `
                                <img src="${row.preview_urls.thumb_image}" style="height: 40px; float: left;">
                                <span>${data}</span>
                                <br>
                                <small style="color: ${row.color}">${row.rarity}</small>
                                `;
                        }
                    },
                    {
                        data: "credits",
                        title: "Credits",
                        searchable: false
                    },
                ]
            });

            datatable.on('draw', function () {
                $('#inventory-total-credits').text(total_credits)
                $('#inventory-total-items').text(total_items)
            })
        } );
    </script>
@endsection


