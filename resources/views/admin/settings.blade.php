@extends('layouts.admin')

@section('title', 'Settings')

@section('content')
    <div class="card">
        <header class="card-header">
            <p class="card-header-title">Settings</p>
        </header>
        <div class="card-content">
            <table id="table">

            </table>
        </div>
    </div>
@endsection

@section('style')
    <link rel="stylesheet" href="//cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css">
@endsection
@section('script')
    <script src="//cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"></script>

    <script>
        const settings = {!! json_encode($settings) !!};

        $(document).ready( function () {
            let datatable = $('#table').DataTable({
                data: settings,
                columns: [
                    {
                        data: "key",
                        title: "Key",
                        render: function ( data, type, row ) {
                            return `<span class="setting-key">${data}</span>`;
                        }
                    },
                    {
                        data: "value",
                        title: "Value",
                        render: function ( data, type, row ) {
                            if(row.type == 'boolean')
                                return `<input class="setting-value" type="checkbox" value="1" ${data == 1 ? 'checked' : ''}>`;
                            if(row.type == 'textarea')
                                return `<textarea style="width: 100%">${data}</textarea>`;
                            if(row.type == 'number')
                                return `<input class="setting-value" type="number" value="${data}">`;

                            return `<input class="setting-value" type="text" value="${data}">`;
                        }
                    },
                    {
                        data: "type",
                        title: "Type",
                        render: function ( data, type, row ) {
                            return `<input class="setting-type" type="text" value="${data}">`;
                        }
                    },
                    {
                        searchable: false,
                        sorting: false,
                        render: function ( data, type, row ) {
                            return `<button class="setting-save">Save</button>`;
                        }
                    },
                ]
            });

            $(document).on('click', '.setting-save', function () {
                const row = $(this).closest('tr')
                const key = row.find('.setting-key').text()
                const type = row.find('.setting-type').val() || 'text'

                let value = row.find('.setting-value').val()
                if(type == 'boolean')
                    value = row.find('.setting-value')[0].checked ? value : 0

                $.ajax({
                    url: "{!! route('admin.settings.save') !!}",
                    method: "POST",
                    data: {
                        key: key,
                        value: value,
                        type: type,
                    }
                })
            })


        } );
    </script>
@endsection


