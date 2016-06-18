table "movies_genres", :embed_in => :movies, :on=> :idmovies do
	before_save do |row|
        row = nil if row.idmovies_genres >= 10
    end
	column "idmovies", :integer, :references => :movies
	column "idgenres", :integer
end

table "movies" do
    before_save do |row|
        row = nil if row.idmovies >= 10
    end

	column "title", :string
	column "year", :integer
	column "number", :integer
	column "type", :integer
	column "location", :string
	column "language", :string
end
