<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateItemsForWorksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('items_for_works', function (Blueprint $table) {
            $table->increments('work_items_id');
            $table->unsignedInteger('worksId')->nullable();
            $table->unsignedInteger('work_stocks_id')->nullable();
            $table->foreign('worksId')->references('work_id')->on('works');
            $table->foreign('work_stocks_id')->references('stock_id')->on('stocks');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('items_for_works');
    }
}
